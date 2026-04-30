"use client";
import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt, useReadContract, useConfig, } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";
import { decodeEventLog } from "viem";
import { ESCROW_ABI } from "../lib/abis";
import { ESCROW_ADDRESS } from "../lib/contracts/addresses";
export var OrderStatus;
(function (OrderStatus) {
    OrderStatus[OrderStatus["Pending"] = 0] = "Pending";
    OrderStatus[OrderStatus["Funded"] = 1] = "Funded";
    OrderStatus[OrderStatus["Completed"] = 2] = "Completed";
    OrderStatus[OrderStatus["Cancelled"] = 3] = "Cancelled";
})(OrderStatus || (OrderStatus = {}));
export function useCreateOrder() {
    const { writeContractAsync, isPending } = useWriteContract();
    const [txHash, setTxHash] = useState(undefined);
    const config = useConfig();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash: txHash,
    });
    const createOrder = async (sellerAddress, amount, productId) => {
        const hash = await writeContractAsync({
            address: ESCROW_ADDRESS,
            abi: ESCROW_ABI,
            functionName: "createOrder",
            args: [sellerAddress, amount, productId],
        });
        setTxHash(hash);
        // Properly wait for on-chain confirmation
        const receipt = await waitForTransactionReceipt(config, { hash });
        // If the tx was included but reverted, throw so the caller shows an error
        if (receipt.status === "reverted") {
            throw new Error("Transaction was reverted on-chain. The order was NOT created.");
        }
        // Parse the actual orderId from the emitted OrderCreated event
        let orderId = undefined;
        for (const log of receipt.logs) {
            try {
                const decoded = decodeEventLog({
                    abi: ESCROW_ABI,
                    data: log.data,
                    topics: log.topics,
                });
                if (decoded.eventName === "OrderCreated") {
                    orderId = decoded.args.orderId;
                    break;
                }
            }
            catch (e) {
                // Ignore logs from other contracts or unrelated events
            }
        }
        return { hash, receipt, orderId };
    };
    return { createOrder, isPending, isConfirming, isSuccess, txHash };
}
export function useConfirmDelivery() {
    const { writeContractAsync, isPending } = useWriteContract();
    const [txHash, setTxHash] = useState(undefined);
    const config = useConfig();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash: txHash,
    });
    const confirmDelivery = async (orderId) => {
        const hash = await writeContractAsync({
            address: ESCROW_ADDRESS,
            abi: ESCROW_ABI,
            functionName: "confirmDelivery",
            args: [orderId],
        });
        setTxHash(hash);
        const receipt = await waitForTransactionReceipt(config, { hash });
        if (receipt.status === "reverted") {
            throw new Error("Confirm delivery transaction was reverted on-chain.");
        }
        return hash;
    };
    return { confirmDelivery, isPending, isConfirming, isSuccess, txHash };
}
export function useCancelOrder() {
    const { writeContractAsync, isPending } = useWriteContract();
    const [txHash, setTxHash] = useState(undefined);
    const config = useConfig();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash: txHash,
    });
    const cancelOrder = async (orderId) => {
        const hash = await writeContractAsync({
            address: ESCROW_ADDRESS,
            abi: ESCROW_ABI,
            functionName: "cancelOrder",
            args: [orderId],
        });
        setTxHash(hash);
        const receipt = await waitForTransactionReceipt(config, { hash });
        if (receipt.status === "reverted") {
            throw new Error("Cancel order transaction was reverted on-chain.");
        }
        return hash;
    };
    return { cancelOrder, isPending, isConfirming, isSuccess, txHash };
}
export function useGetOrder(orderId) {
    const { data, isLoading, refetch } = useReadContract({
        address: ESCROW_ADDRESS,
        abi: ESCROW_ABI,
        functionName: "getOrder",
        args: orderId ? [orderId] : undefined,
        query: { enabled: !!orderId },
    });
    return { order: data, isLoading, refetch };
}
