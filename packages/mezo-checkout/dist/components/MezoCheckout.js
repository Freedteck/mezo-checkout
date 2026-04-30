"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { parseUnits, formatUnits } from "viem";
import { Bitcoin, Wallet, ChevronRight, Loader2, CheckCircle2, } from "lucide-react";
import { useMUSDBalance, useMUSDAllowance, useMUSDApprove, useMUSDTransfer, } from "../hooks/useMUSD";
import { useCreateOrder } from "../hooks/useEscrow";
import { useOpenTrove, calcCollateral } from "../hooks/useRouter";
import { useOrders } from "../hooks/useOrders";
import { EXPLORER_URL } from "../lib/contracts/addresses";
export function MezoCheckout({ product, sellerAddress, useEscrow = true, onSuccess, onError, }) {
    const { isConnected } = useAccount();
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
                onSuccess?.(product.id, hash);
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
                onSuccess?.(product.id, hash);
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
    // ─── Success screen ───────────────────────────────────────────────────────
    if (step === "success" && successData) {
        return (_jsxs("div", { className: "flex flex-col gap-4", children: [_jsxs("div", { className: "flex items-center gap-3 text-emerald-400", children: [_jsx(CheckCircle2, { className: "w-6 h-6 shrink-0" }), _jsxs("div", { children: [_jsx("p", { className: "font-black text-sm tracking-widest uppercase", children: "Order Confirmed" }), _jsx("p", { className: "text-[11px] text-[#a0a0a5] mt-0.5", children: useEscrow ? "MUSD held in escrow until delivery" : "MUSD paid directly to seller" })] })] }), _jsxs("a", { href: `${EXPLORER_URL}/tx/${successData.txHash}`, target: "_blank", rel: "noopener noreferrer", className: "text-xs text-orange-400 hover:text-orange-300 underline font-mono break-all", children: [successData.txHash.slice(0, 20), "\u2026", successData.txHash.slice(-8), " \u2197"] })] }));
    }
    // ─── Not connected ────────────────────────────────────────────────────────
    if (!isConnected) {
        return (_jsxs("div", { className: "flex flex-col items-center gap-3 py-2", children: [_jsx("p", { className: "text-sm text-[#a0a0a5]", children: "Connect your Mezo wallet to pay." }), _jsx(ConnectButton, { label: "Connect via Mezo Passport" })] }));
    }
    const isLoading = isApproving ||
        isApprovalConfirming ||
        isCreating ||
        isOrderConfirming ||
        isTransferring ||
        isTransferConfirming ||
        isBorrowing ||
        isBorrowConfirming;
    // ─── Mode selector ────────────────────────────────────────────────────────
    if (mode === "select") {
        return (_jsxs("div", { className: "flex flex-col gap-3", children: [_jsxs("div", { className: "flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 border border-white/10 mb-2", children: [_jsx("span", { className: "text-xs text-[#a0a0a5] font-bold uppercase tracking-widest", children: "Total" }), _jsxs("span", { className: "font-black text-white", children: [product.price, " MUSD"] })] }), errorMessage && (_jsx("p", { className: "text-xs text-red-300 bg-red-400/10 rounded-xl px-3 py-2 break-all", children: errorMessage })), _jsxs("button", { onClick: () => setMode("musd"), disabled: !hasEnoughBalance, className: "w-full flex items-center justify-between rounded-2xl px-5 py-4 border transition-all\n            bg-white/2 border-white/10 hover:border-orange-500/40 hover:bg-white/4\n            disabled:opacity-40 disabled:cursor-not-allowed group", children: [_jsxs("div", { className: "flex items-center gap-3 text-left", children: [_jsx(Wallet, { className: "w-5 h-5 text-orange-400 shrink-0" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-black text-white", children: "Pay with MUSD" }), _jsxs("p", { className: "text-[11px] text-[#a0a0a5]", children: ["Balance: ", balance !== undefined ? parseFloat(formatUnits(balance, 18)).toFixed(4) : "—", " MUSD", !hasEnoughBalance && " (insufficient)"] })] })] }), _jsx(ChevronRight, { className: "w-4 h-4 text-[#a0a0a5] group-hover:text-white transition-colors" })] }), _jsxs("button", { onClick: () => setMode("borrow"), className: "w-full flex items-center justify-between rounded-2xl px-5 py-4 border transition-all\n            bg-linear-to-br from-orange-500/10 to-amber-600/5 border-orange-500/30\n            hover:border-orange-500/60 hover:from-orange-500/15 group", children: [_jsxs("div", { className: "flex items-center gap-3 text-left", children: [_jsx(Bitcoin, { className: "w-5 h-5 text-orange-500 shrink-0" }), _jsxs("div", { children: [_jsxs("p", { className: "text-sm font-black text-white", children: ["Borrow & Pay", _jsx("span", { className: "ml-2 text-[9px] font-black text-orange-400 bg-orange-400/10 px-1.5 py-0.5 rounded tracking-widest uppercase", children: "Self-Custodial" })] }), _jsx("p", { className: "text-[11px] text-[#a0a0a5]", children: "Mint MUSD against BTC & pay sequentially" })] })] }), _jsx(ChevronRight, { className: "w-4 h-4 text-[#a0a0a5] group-hover:text-orange-400 transition-colors" })] }), _jsx("p", { className: "text-center text-[10px] text-[#606065] pt-1", children: "Powered by Mezo \u00B7 Bitcoin-backed MUSD" })] }));
    }
    // ─── MUSD Pay screen ──────────────────────────────────────────────────────
    if (mode === "musd") {
        return (_jsxs("div", { className: "flex flex-col gap-4", children: [_jsx("button", { onClick: () => setMode("select"), className: "text-xs text-[#a0a0a5] hover:text-white text-left", children: "\u2190 Back" }), errorMessage && (_jsx("p", { className: "text-xs text-red-300 bg-red-400/10 rounded-xl px-3 py-2 break-all", children: errorMessage })), _jsx("button", { onClick: handleMUSDCheckout, disabled: isLoading || !hasEnoughBalance, className: "w-full rounded-xl px-6 py-3.5 font-black text-white text-sm tracking-widest uppercase transition-all\n            bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400\n            disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20 active:scale-[0.98]", children: isLoading ? (_jsxs("span", { className: "flex items-center justify-center gap-2", children: [_jsx(Loader2, { className: "w-4 h-4 animate-spin" }), "Processing..."] })) : (useEscrow ? `Pay into Escrow (${product.price} MUSD)` : `Pay Directly (${product.price} MUSD)`) })] }));
    }
    // ─── Borrow & Pay screen ──────────────────────────────────────────────────
    return (_jsxs("div", { className: "flex flex-col gap-4", children: [_jsx("button", { onClick: () => setMode("select"), className: "text-xs text-[#a0a0a5] hover:text-white text-left", children: "\u2190 Back" }), _jsxs("div", { className: "rounded-2xl bg-white/2 border border-orange-500/20 p-4 space-y-2 text-xs text-[#a0a0a5]", children: [_jsx("p", { className: "font-black text-white text-[11px] uppercase tracking-widest", children: "How it works" }), _jsxs("p", { children: ["1. ", _jsx("span", { className: "text-white font-bold", children: "Sign 1:" }), " Lock BTC to open your self-custodial Trove."] }), _jsxs("p", { children: ["2. ", _jsx("span", { className: "text-orange-400 font-bold", children: "1,800 MUSD" }), " minimum is minted to your wallet."] }), _jsxs("p", { children: ["3. ", _jsx("span", { className: "text-white font-bold", children: "Sign 2:" }), " ", product.price, " MUSD routes to ", useEscrow ? "Escrow" : "Seller", " automatically."] }), _jsxs("div", { className: "border-t border-white/5 pt-2 flex items-center justify-between", children: [_jsx("span", { children: "Est. BTC to lock:" }), _jsxs("span", { className: "text-white font-bold font-mono", children: [estCollateralBtc, " BTC"] })] }), _jsx("p", { className: "text-[10px] text-[#505055] italic", children: "Min. 1,800 MUSD Trove debt required by protocol \u00B7 200% CR" })] }), errorMessage && (_jsx("p", { className: "text-xs text-red-300 bg-red-400/10 rounded-xl px-3 py-2 break-all", children: errorMessage })), _jsx("button", { onClick: handleBorrowAndPay, disabled: isLoading, className: "w-full rounded-xl px-6 py-3.5 font-black text-white text-sm tracking-widest uppercase transition-all\n          bg-linear-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400\n          disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/30 active:scale-[0.98]", children: isLoading ? (_jsxs("span", { className: "flex items-center justify-center gap-2", children: [_jsx(Loader2, { className: "w-4 h-4 animate-spin" }), step === "opening_trove" ? "Opening Trove (1/2)..." :
                            step === "approving" ? "Approving MUSD..." :
                                useEscrow ? "Funding Escrow (2/2)..." : "Sending Payment (2/2)..."] })) : (`Borrow & Pay ${product.price} MUSD`) })] }));
}
