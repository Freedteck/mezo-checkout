"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { parseUnits, formatUnits } from "viem";
import { Bitcoin, Wallet, ChevronRight, ChevronLeft, CheckCircle2, X, } from "lucide-react";
import { useMUSDBalance, useMUSDAllowance, useMUSDApprove, useMUSDTransfer, } from "../hooks/useMUSD";
import { useCreateOrder } from "../hooks/useEscrow";
import { useOpenTrove, calcCollateral } from "../hooks/useRouter";
import { useOrders } from "../hooks/useOrders";
import { EXPLORER_URL } from "../lib/contracts/addresses";
import styles from "./MezoCheckout.module.css";
export function MezoCheckout({ product, sellerAddress, useEscrow = true, isModal = false, buttonText = "Pay with Mezo", theme = "system", onSuccess, onError, }) {
    const { isConnected } = useAccount();
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState("select");
    const [step, setStep] = useState("idle");
    const [successData, setSuccessData] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const { addOrder } = useOrders();
    const amount = parseUnits(product.price.toString(), 18);
    // MUSD path hooks
    const { raw: balance, refetch: refetchBalance } = useMUSDBalance();
    const { raw: allowance, refetch: refetchAllowance } = useMUSDAllowance();
    const { approve, isPending: isApproving, isConfirming: isApprovalConfirming, } = useMUSDApprove();
    const { createOrder, isPending: isCreating, isConfirming: isOrderConfirming, } = useCreateOrder();
    const { transfer, isPending: isTransferring, isConfirming: isTransferConfirming, } = useMUSDTransfer();
    // Borrow path hook
    const { openTrove, isPending: isBorrowing, isConfirming: isBorrowConfirming, } = useOpenTrove();
    const hasEnoughBalance = balance !== undefined && balance >= amount;
    const hasEnoughAllowance = allowance !== undefined && allowance >= amount;
    // Estimated collateral required
    const amountWhole = amount / 10n ** 18n || 1800n;
    const borrowTarget = amountWhole > 1800n ? amountWhole : 1800n;
    const estCollateral = calcCollateral(borrowTarget);
    const estCollateralBtc = parseFloat(formatUnits(estCollateral, 18)).toFixed(6);
    // ─── MUSD path ────────────────────────────────────────────────────────────
    const handleMUSDCheckout = async () => {
        setErrorMessage(null);
        try {
            if (useEscrow) {
                if (!hasEnoughAllowance) {
                    setStep("approving");
                    await approve(amount);
                    await refetchAllowance();
                }
                setStep("paying");
                const { hash, orderId } = await createOrder(sellerAddress, amount, product.id);
                setSuccessData({ txHash: hash });
                addOrder(orderId || hash);
                setStep("success");
                onSuccess?.(orderId || hash, hash);
            }
            else {
                setStep("paying");
                const hash = await transfer(sellerAddress, amount);
                setSuccessData({ txHash: hash });
                setStep("success");
                onSuccess?.(product.id, hash);
            }
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error("Transaction failed");
            setErrorMessage(error.message.slice(0, 160));
            setStep("idle");
            onError?.(error);
        }
    };
    // ─── Borrow & Pay path (Sequential) ───────────────────────────────────────
    const handleBorrowAndPay = async () => {
        setErrorMessage(null);
        try {
            // Step 1: Open Trove
            setStep("opening_trove");
            await openTrove(amount, estCollateral);
            await refetchBalance(); // Fetch new MUSD balance
            // Step 2 & 3: Pay (Escrow or Direct)
            if (useEscrow) {
                if (!hasEnoughAllowance) {
                    setStep("approving");
                    await approve(amount);
                    await refetchAllowance();
                }
                setStep("funding_escrow");
                const { hash, orderId } = await createOrder(sellerAddress, amount, product.id);
                setSuccessData({ txHash: hash });
                addOrder(orderId || hash);
                setStep("success");
                onSuccess?.(orderId || hash, hash);
            }
            else {
                setStep("paying");
                const hash = await transfer(sellerAddress, amount);
                setSuccessData({ txHash: hash });
                setStep("success");
                onSuccess?.(product.id, hash);
            }
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error("Transaction failed");
            setErrorMessage(error.message.slice(0, 160));
            setStep("idle");
            onError?.(error);
        }
    };
    const renderCheckout = () => {
        // ─── Success screen ───────────────────────────────────────────────────────
        if (step === "success" && successData) {
            return (_jsxs("div", { className: "flex flex-col gap-4", children: [_jsxs("div", { className: "flex items-center gap-3 text-emerald-400", children: [_jsx(CheckCircle2, { className: "w-6 h-6 shrink-0" }), _jsxs("div", { children: [_jsx("p", { className: "font-black text-sm tracking-widest uppercase", children: "Order Confirmed" }), _jsx("p", { className: "text-[11px] text-[#a0a0a5] mt-0.5", children: useEscrow
                                            ? "MUSD held in escrow until delivery"
                                            : "MUSD paid directly to seller" })] })] }), _jsxs("a", { href: `${EXPLORER_URL}/tx/${successData.txHash}`, target: "_blank", rel: "noopener noreferrer", className: "text-xs text-orange-400 hover:text-orange-300 underline font-mono break-all", children: [successData.txHash.slice(0, 20), "\u2026", successData.txHash.slice(-8), " \u2197"] })] }));
        }
        // ─── Not connected ────────────────────────────────────────────────────────
        if (!isConnected) {
            return (_jsxs("div", { className: "flex flex-col items-center gap-3 py-2", children: [_jsx("p", { className: "text-sm text-[#a0a0a5]", children: "Connect your Mezo wallet to pay." }), _jsx(ConnectButton, { label: "Connect via Mezo Passport" })] }));
        }
        // ─── Mode selector ────────────────────────────────────────────────────────
        if (mode === "select") {
            return (_jsxs("div", { className: styles.container, children: [_jsxs("div", { className: styles.productCard, children: [product.image && (_jsx("img", { src: product.image, alt: product.name, className: styles.productImage })), _jsxs("div", { className: styles.productInfo, children: [_jsx("p", { className: styles.productName, children: product.name }), _jsx("p", { className: styles.productDesc, children: product.description })] })] }), _jsxs("div", { className: styles.totalRow, children: [_jsx("span", { className: styles.totalLabel, children: "Total" }), _jsxs("span", { className: styles.totalValue, children: [product.price, " MUSD"] })] }), errorMessage && (_jsx("p", { className: styles.errorMessage, children: errorMessage })), _jsxs("button", { onClick: () => setMode("musd"), className: `${styles.btn} ${styles.btnMUSD}`, children: [_jsxs("div", { className: styles.btnContent, children: [_jsx(Wallet, { size: 20, color: "#0066FF", style: { flexShrink: 0 } }), _jsxs("div", { children: [_jsx("p", { className: styles.btnTitle, children: "Pay with MUSD" }), _jsx("p", { className: styles.btnSubtitle, children: "Pay directly using your MUSD balance" })] })] }), _jsx(ChevronRight, { size: 16, color: "rgba(255, 255, 255, 0.5)" })] }), _jsxs("button", { onClick: () => setMode("borrow"), className: `${styles.btn} ${styles.btnBorrow}`, children: [_jsxs("div", { className: styles.btnContent, children: [_jsx(Bitcoin, { size: 20, color: "#0066FF", style: { flexShrink: 0 } }), _jsxs("div", { children: [_jsxs("p", { className: styles.btnTitle, children: ["Borrow & Pay", _jsx("span", { className: styles.badge, children: "Self-Custodial" })] }), _jsx("p", { className: styles.btnSubtitle, children: "Mint MUSD against BTC & pay sequentially" })] })] }), _jsx(ChevronRight, { size: 16, color: "#0066FF" })] }), _jsx("p", { className: styles.poweredBy, children: "Powered by Mezo \u00B7 Bitcoin-backed MUSD" })] }));
        }
        // ─── MUSD Pay screen ──────────────────────────────────────────────────────
        if (mode === "musd") {
            return (_jsxs("div", { className: styles.container, children: [_jsxs("button", { onClick: () => setMode("select"), disabled: step !== "idle", className: styles.backBtn, style: {
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            opacity: step !== "idle" ? 0.5 : 1,
                            cursor: step !== "idle" ? "not-allowed" : "pointer",
                        }, children: [_jsx(ChevronLeft, { size: 16 }), " Back"] }), errorMessage && (_jsx("p", { className: styles.errorMessage, children: errorMessage })), _jsx("button", { onClick: handleMUSDCheckout, disabled: step !== "idle", className: styles.primaryBtn, children: step === "approving"
                            ? "Approving MUSD..."
                            : step === "paying"
                                ? "Confirming Payment..."
                                : useEscrow
                                    ? `Pay into Escrow (${product.price} MUSD)`
                                    : `Pay Directly (${product.price} MUSD)` })] }));
        }
        // ─── Borrow & Pay screen ──────────────────────────────────────────────────
        return (_jsxs("div", { className: styles.container, children: [_jsxs("button", { onClick: () => setMode("select"), disabled: step !== "idle", className: styles.backBtn, style: {
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        opacity: step !== "idle" ? 0.5 : 1,
                        cursor: step !== "idle" ? "not-allowed" : "pointer",
                    }, children: [_jsx(ChevronLeft, { size: 16 }), " Back"] }), _jsxs("div", { className: styles.infoBox, children: [_jsx("p", { className: styles.infoTitle, children: "How it works" }), _jsxs("p", { children: ["1. ", _jsx("span", { className: styles.boldWhite, children: "Sign 1:" }), " Lock BTC to open your self-custodial Trove."] }), _jsxs("p", { children: ["2. ", _jsx("span", { className: styles.boldBlue, children: "1,800 MUSD" }), " minimum is minted to your wallet."] }), _jsxs("p", { children: ["3. ", _jsx("span", { className: styles.boldWhite, children: "Sign 2:" }), " ", product.price, " ", "MUSD routes to ", useEscrow ? "Escrow" : "Seller", " automatically."] }), _jsx("div", { className: styles.infoDivider }), _jsxs("div", { className: styles.infoRow, children: [_jsx("span", { children: "Est. BTC to lock:" }), _jsxs("span", { className: styles.infoValue, children: [estCollateralBtc, " BTC"] })] }), _jsx("p", { className: styles.italicText, children: "Min. 1,800 MUSD Trove debt required by protocol \u00B7 200% CR" })] }), errorMessage && _jsx("p", { className: styles.errorMessage, children: errorMessage }), _jsx("button", { onClick: handleBorrowAndPay, disabled: step !== "idle", className: styles.primaryBtn, children: step === "opening_trove"
                        ? "Opening Trove..."
                        : step === "approving"
                            ? "Approving MUSD..."
                            : step === "paying"
                                ? "Confirming Payment..."
                                : `Borrow & Pay ${product.price} MUSD` })] }));
    };
    const checkoutContent = renderCheckout();
    if (isModal) {
        return (_jsxs("div", { className: styles.themeWrapper, "data-theme": theme === "system" ? undefined : theme, children: [_jsx("button", { onClick: () => setIsOpen(true), className: styles.modalTriggerBtn, children: buttonText }), isOpen && (_jsx("div", { className: styles.modalOverlay, onClick: () => setIsOpen(false), children: _jsxs("div", { className: styles.modalContent, onClick: (e) => e.stopPropagation(), children: [_jsx("button", { className: styles.closeBtn, onClick: () => setIsOpen(false), children: _jsx(X, { size: 16 }) }), checkoutContent] }) }))] }));
    }
    return (_jsx("div", { className: `${styles.themeWrapper} ${styles.inlineContainer}`, "data-theme": theme === "system" ? undefined : theme, children: checkoutContent }));
}
