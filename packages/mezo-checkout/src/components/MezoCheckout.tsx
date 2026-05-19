"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { parseUnits, formatUnits } from "viem";
import {
  Bitcoin,
  Wallet,
  ChevronRight,
  ChevronLeft,
  Loader2,
  CheckCircle2,
  X,
} from "lucide-react";
import {
  useMUSDBalance,
  useMUSDAllowance,
  useMUSDApprove,
  useMUSDTransfer,
} from "../hooks/useMUSD";
import { useCreateOrder } from "../hooks/useEscrow";
import { useOpenTrove, calcCollateral } from "../hooks/useRouter";
import { useOrders } from "../hooks/useOrders";
import { EXPLORER_URL } from "../lib/contracts/addresses";
import type { Product } from "../lib/types";
import styles from "./MezoCheckout.module.css";

interface MezoCheckoutProps {
  product: Product;
  sellerAddress: `0x${string}`;
  useEscrow?: boolean;
  isModal?: boolean;
  buttonText?: string;
  theme?: "light" | "dark" | "system";
  onSuccess?: (orderId: `0x${string}`, txHash: string) => void;
  onError?: (error: Error) => void;
}

type Mode = "select" | "musd" | "borrow";
type Step =
  | "idle"
  | "approving"
  | "paying"
  | "success"
  | "opening_trove"
  | "funding_escrow";

export function MezoCheckout({
  product,
  sellerAddress,
  useEscrow = true,
  isModal = false,
  buttonText = "Pay with Mezo",
  theme = "system",
  onSuccess,
  onError,
}: MezoCheckoutProps) {
  const { isConnected } = useAccount();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("select");
  const [step, setStep] = useState<Step>("idle");
  const [successData, setSuccessData] = useState<{ txHash: string } | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { addOrder } = useOrders();

  const amount = parseUnits(product.price.toString(), 18);

  // MUSD path hooks
  const { raw: balance, refetch: refetchBalance } = useMUSDBalance();
  const { raw: allowance, refetch: refetchAllowance } = useMUSDAllowance();
  const {
    approve,
    isPending: isApproving,
    isConfirming: isApprovalConfirming,
  } = useMUSDApprove();
  const {
    createOrder,
    isPending: isCreating,
    isConfirming: isOrderConfirming,
  } = useCreateOrder();
  const {
    transfer,
    isPending: isTransferring,
    isConfirming: isTransferConfirming,
  } = useMUSDTransfer();

  // Borrow path hook
  const {
    openTrove,
    isPending: isBorrowing,
    isConfirming: isBorrowConfirming,
  } = useOpenTrove();

  const hasEnoughBalance = balance !== undefined && balance >= amount;
  const hasEnoughAllowance = allowance !== undefined && allowance >= amount;

  // Estimated collateral required
  const amountWhole = amount / 10n ** 18n || 1800n;
  const borrowTarget = amountWhole > 1800n ? amountWhole : 1800n;
  const estCollateral = calcCollateral(borrowTarget);
  const estCollateralBtc = parseFloat(formatUnits(estCollateral, 18)).toFixed(
    6,
  );

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
        const { hash, orderId } = await createOrder(
          sellerAddress,
          amount,
          product.id,
        );
        setSuccessData({ txHash: hash });
        addOrder(orderId || hash);
        setStep("success");
        onSuccess?.(orderId || (hash as `0x${string}`), hash);
      } else {
        setStep("paying");
        const hash = await transfer(sellerAddress, amount);
        setSuccessData({ txHash: hash });
        setStep("success");
        onSuccess?.(product.id as `0x${string}`, hash);
      }
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Transaction failed");
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
        const { hash, orderId } = await createOrder(
          sellerAddress,
          amount,
          product.id,
        );
        setSuccessData({ txHash: hash });
        addOrder(orderId || hash);
        setStep("success");
        onSuccess?.(orderId || (hash as `0x${string}`), hash);
      } else {
        setStep("paying");
        const hash = await transfer(sellerAddress, amount);
        setSuccessData({ txHash: hash });
        setStep("success");
        onSuccess?.(product.id as `0x${string}`, hash);
      }
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Transaction failed");
      setErrorMessage(error.message.slice(0, 160));
      setStep("idle");
      onError?.(error);
    }
  };

  const renderCheckout = () => {
    // ─── Success screen ───────────────────────────────────────────────────────
    if (step === "success" && successData) {
      return (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 text-emerald-400">
            <CheckCircle2 className="w-6 h-6 shrink-0" />
            <div>
              <p className="font-black text-sm tracking-widest uppercase">
                Order Confirmed
              </p>
              <p className="text-[11px] text-[#a0a0a5] mt-0.5">
                {useEscrow
                  ? "MUSD held in escrow until delivery"
                  : "MUSD paid directly to seller"}
              </p>
            </div>
          </div>
          <a
            href={`${EXPLORER_URL}/tx/${successData.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-orange-400 hover:text-orange-300 underline font-mono break-all"
          >
            {successData.txHash.slice(0, 20)}…{successData.txHash.slice(-8)} ↗
          </a>
        </div>
      );
    }

    // ─── Not connected ────────────────────────────────────────────────────────
    if (!isConnected) {
      return (
        <div className="flex flex-col items-center gap-3 py-2">
          <p className="text-sm text-[#a0a0a5]">
            Connect your Mezo wallet to pay.
          </p>
          <ConnectButton label="Connect via Mezo Passport" />
        </div>
      );
    }

    // ─── Mode selector ────────────────────────────────────────────────────────
    if (mode === "select") {
      return (
        <div className={styles.container}>
          <div className={styles.productCard}>
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className={styles.productImage}
              />
            )}
            <div className={styles.productInfo}>
              <p className={styles.productName}>{product.name}</p>
              <p className={styles.productDesc}>{product.description}</p>
            </div>
          </div>

          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Total</span>
            <span className={styles.totalValue}>{product.price} MUSD</span>
          </div>

          {errorMessage && (
            <p className={styles.errorMessage}>{errorMessage}</p>
          )}

          {/* Button 1: Pay with MUSD */}
          <button
            onClick={() => setMode("musd")}
            className={`${styles.btn} ${styles.btnMUSD}`}
          >
            <div className={styles.btnContent}>
              <Wallet size={20} color="#0066FF" style={{ flexShrink: 0 }} />
              <div>
                <p className={styles.btnTitle}>Pay with MUSD</p>
                <p className={styles.btnSubtitle}>
                  Pay directly using your MUSD balance
                </p>
              </div>
            </div>
            <ChevronRight size={16} color="rgba(255, 255, 255, 0.5)" />
          </button>

          {/* Button 2: Borrow & Pay */}
          <button
            onClick={() => setMode("borrow")}
            className={`${styles.btn} ${styles.btnBorrow}`}
          >
            <div className={styles.btnContent}>
              <Bitcoin size={20} color="#0066FF" style={{ flexShrink: 0 }} />
              <div>
                <p className={styles.btnTitle}>
                  Borrow &amp; Pay
                  <span className={styles.badge}>Self-Custodial</span>
                </p>
                <p className={styles.btnSubtitle}>
                  Mint MUSD against BTC &amp; pay sequentially
                </p>
              </div>
            </div>
            <ChevronRight size={16} color="#0066FF" />
          </button>

          <p className={styles.poweredBy}>
            Powered by Mezo · Bitcoin-backed MUSD
          </p>
        </div>
      );
    }

    // ─── MUSD Pay screen ──────────────────────────────────────────────────────
    if (mode === "musd") {
      return (
        <div className={styles.container}>
          <button
            onClick={() => setMode("select")}
            disabled={step !== "idle"}
            className={styles.backBtn}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              opacity: step !== "idle" ? 0.5 : 1,
              cursor: step !== "idle" ? "not-allowed" : "pointer",
            }}
          >
            <ChevronLeft size={16} /> Back
          </button>
          {errorMessage && (
            <p className={styles.errorMessage}>{errorMessage}</p>
          )}
          <button
            onClick={handleMUSDCheckout}
            disabled={step !== "idle"}
            className={styles.primaryBtn}
          >
            {step === "approving"
              ? "Approving MUSD..."
              : step === "paying"
                ? "Confirming Payment..."
                : useEscrow
                  ? `Pay into Escrow (${product.price} MUSD)`
                  : `Pay Directly (${product.price} MUSD)`}
          </button>
        </div>
      );
    }

    // ─── Borrow & Pay screen ──────────────────────────────────────────────────
    return (
      <div className={styles.container}>
        <button
          onClick={() => setMode("select")}
          disabled={step !== "idle"}
          className={styles.backBtn}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            opacity: step !== "idle" ? 0.5 : 1,
            cursor: step !== "idle" ? "not-allowed" : "pointer",
          }}
        >
          <ChevronLeft size={16} /> Back
        </button>

        <div className={styles.infoBox}>
          <p className={styles.infoTitle}>How it works</p>
          <p>
            1. <span className={styles.boldWhite}>Sign 1:</span> Lock BTC to
            open your self-custodial Trove.
          </p>
          <p>
            2. <span className={styles.boldBlue}>1,800 MUSD</span> minimum is
            minted to your wallet.
          </p>
          <p>
            3. <span className={styles.boldWhite}>Sign 2:</span> {product.price}{" "}
            MUSD routes to {useEscrow ? "Escrow" : "Seller"} automatically.
          </p>

          <div className={styles.infoDivider} />

          <div className={styles.infoRow}>
            <span>Est. BTC to lock:</span>
            <span className={styles.infoValue}>{estCollateralBtc} BTC</span>
          </div>
          <p className={styles.italicText}>
            Min. 1,800 MUSD Trove debt required by protocol · 200% CR
          </p>
        </div>

        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

        <button
          onClick={handleBorrowAndPay}
          disabled={step !== "idle"}
          className={styles.primaryBtn}
        >
          {step === "opening_trove"
            ? "Opening Trove..."
            : step === "approving"
              ? "Approving MUSD..."
              : step === "paying"
                ? "Confirming Payment..."
                : `Borrow & Pay ${product.price} MUSD`}
        </button>
      </div>
    );
  };

  const checkoutContent = renderCheckout();

  if (isModal) {
    return (
      <div
        className={styles.themeWrapper}
        data-theme={theme === "system" ? undefined : theme}
      >
        <button
          onClick={() => setIsOpen(true)}
          className={styles.modalTriggerBtn}
        >
          {buttonText}
        </button>
        {isOpen && (
          <div className={styles.modalOverlay} onClick={() => setIsOpen(false)}>
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={styles.closeBtn}
                onClick={() => setIsOpen(false)}
              >
                <X size={16} />
              </button>
              {checkoutContent}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`${styles.themeWrapper} ${styles.inlineContainer}`}
      data-theme={theme === "system" ? undefined : theme}
    >
      {checkoutContent}
    </div>
  );
}
