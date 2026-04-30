/**
 * Calculate the BTC collateral needed to safely borrow `musdAmount` MUSD.
 * Uses a 200% collateral ratio (safe margin above 150% minimum).
 * IMPORTANT: Adds 200 MUSD Liquity gas compensation to the debt.
 */
export declare function calcCollateral(musdAmount: bigint, btcPriceInMusd?: bigint): bigint;
export declare function useOpenTrove(): {
    openTrove: (borrowAmount: bigint, collateralBtc: bigint) => Promise<{
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
    }>;
    isPending: boolean;
    isConfirming: boolean;
    isSuccess: boolean;
    txHash: `0x${string}` | undefined;
};
//# sourceMappingURL=useRouter.d.ts.map