"use client";
import { useState } from "react";
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount, useConfig, } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";
import { formatUnits } from "viem";
import { MUSD_ABI } from "../lib/abis";
import { MUSD_ADDRESS, ESCROW_ADDRESS } from "../lib/contracts/addresses";
export function useMUSDBalance() {
    const { address } = useAccount();
    const { data, isLoading, refetch } = useReadContract({
        address: MUSD_ADDRESS,
        abi: MUSD_ABI,
        functionName: "balanceOf",
        args: address ? [address] : undefined,
        query: { enabled: !!address },
    });
    return {
        raw: data,
        formatted: data
            ? parseFloat(formatUnits(data, 18)).toFixed(2)
            : "0",
        isLoading,
        refetch,
    };
}
export function useMUSDAllowance() {
    const { address } = useAccount();
    const { data, isLoading, refetch } = useReadContract({
        address: MUSD_ADDRESS,
        abi: MUSD_ABI,
        functionName: "allowance",
        args: address ? [address, ESCROW_ADDRESS] : undefined,
        query: { enabled: !!address },
    });
    return {
        raw: data,
        isLoading,
        refetch,
    };
}
export function useMUSDApprove() {
    const { writeContractAsync, isPending } = useWriteContract();
    const [txHash, setTxHash] = useState(undefined);
    const config = useConfig();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash: txHash,
    });
    const approve = async (amount) => {
        const hash = await writeContractAsync({
            address: MUSD_ADDRESS,
            abi: MUSD_ABI,
            functionName: "approve",
            args: [ESCROW_ADDRESS, amount],
        });
        setTxHash(hash);
        // CRITICAL FIX: Wait for the approve transaction to actually be mined 
        // before allowing the UI to proceed to createOrder.
        await waitForTransactionReceipt(config, { hash });
        return hash;
    };
    return { approve, isPending, isConfirming, isSuccess };
}
export function useMUSDTransfer() {
    const { writeContractAsync, isPending } = useWriteContract();
    const [txHash, setTxHash] = useState(undefined);
    const config = useConfig();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash: txHash,
    });
    const transfer = async (to, amount) => {
        const hash = await writeContractAsync({
            address: MUSD_ADDRESS,
            abi: MUSD_ABI,
            functionName: "transfer",
            args: [to, amount],
        });
        setTxHash(hash);
        // Wait for the transfer transaction to actually be mined
        await waitForTransactionReceipt(config, { hash });
        return hash;
    };
    return { transfer, isPending, isConfirming, isSuccess };
}
