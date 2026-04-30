"use client";
import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt, useConfig } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";
import { BORROWER_OPERATIONS_ABI } from "../lib/abis";
import { BORROWER_OPERATIONS_ADDRESS, DEMO_BTC_PRICE } from "../lib/contracts/addresses";
/**
 * Calculate the BTC collateral needed to safely borrow `musdAmount` MUSD.
 * Uses a 200% collateral ratio (safe margin above 150% minimum).
 * IMPORTANT: Adds 200 MUSD Liquity gas compensation to the debt.
 */
export function calcCollateral(musdAmount, btcPriceInMusd = DEMO_BTC_PRICE) {
    const GAS_COMPENSATION = 200n; // Liquity protocol constant
    const cr = 200n; // 200% collateral ratio
    const compositeDebt = musdAmount + GAS_COMPENSATION;
    return (compositeDebt * cr * 10n ** 18n) / (100n * btcPriceInMusd);
}
export function useOpenTrove() {
    const { writeContractAsync, isPending } = useWriteContract();
    const [txHash, setTxHash] = useState(undefined);
    const config = useConfig();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash: txHash,
    });
    const openTrove = async (borrowAmount, collateralBtc) => {
        // Borrow 10% more than the pay amount to cover the Mezo borrowing fee (~0.5%)
        // and ensure MIN_NET_DEBT is satisfied on testnet (Liquity default is 2000 MUSD)
        const MIN_NET_DEBT = 1800n * 10n ** 18n;
        const finalBorrowAmount = borrowAmount > MIN_NET_DEBT ? borrowAmount : MIN_NET_DEBT;
        const hash = await writeContractAsync({
            address: BORROWER_OPERATIONS_ADDRESS,
            abi: BORROWER_OPERATIONS_ABI,
            functionName: "openTrove",
            args: [
                finalBorrowAmount, // _musdAmount
                "0x0000000000000000000000000000000000000000", // _upperHint
                "0x0000000000000000000000000000000000000000",
            ],
            value: collateralBtc, // BTC collateral
        });
        setTxHash(hash);
        const receipt = await waitForTransactionReceipt(config, { hash });
        if (receipt.status === "reverted") {
            throw new Error("Trove creation was reverted. Check collateral amount.");
        }
        return { hash, receipt };
    };
    return { openTrove, isPending, isConfirming, isSuccess, txHash };
}
