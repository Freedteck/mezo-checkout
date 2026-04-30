export declare enum OrderStatus {
    Pending = 0,
    Funded = 1,
    Completed = 2,
    Cancelled = 3
}
export declare function useCreateOrder(): {
    createOrder: (sellerAddress: `0x${string}`, amount: bigint, productId: string) => Promise<{
        hash: `0x${string}`;
        receipt: {
            blobGasPrice?: bigint | undefined;
            blobGasUsed?: bigint | undefined;
            blockHash: import("viem").Hash;
            blockNumber: bigint;
            blockTimestamp?: bigint | undefined;
            contractAddress: import("viem").Address | null | undefined;
            cumulativeGasUsed: bigint;
            effectiveGasPrice: bigint;
            from: import("viem").Address;
            gasUsed: bigint;
            logs: import("viem").Log<bigint, number, false>[];
            logsBloom: import("viem").Hex;
            root?: `0x${string}` | undefined;
            status: "success" | "reverted";
            to: import("viem").Address | null;
            transactionHash: import("viem").Hash;
            transactionIndex: number;
            type: import("viem").TransactionType;
            chainId: number;
        };
        orderId: `0x${string}` | undefined;
    }>;
    isPending: boolean;
    isConfirming: boolean;
    isSuccess: boolean;
    txHash: `0x${string}` | undefined;
};
export declare function useConfirmDelivery(): {
    confirmDelivery: (orderId: `0x${string}`) => Promise<`0x${string}`>;
    isPending: boolean;
    isConfirming: boolean;
    isSuccess: boolean;
    txHash: `0x${string}` | undefined;
};
export declare function useCancelOrder(): {
    cancelOrder: (orderId: `0x${string}`) => Promise<`0x${string}`>;
    isPending: boolean;
    isConfirming: boolean;
    isSuccess: boolean;
    txHash: `0x${string}` | undefined;
};
export declare function useGetOrder(orderId: `0x${string}` | undefined): any;
//# sourceMappingURL=useEscrow.d.ts.map