export declare function useMUSDBalance(): any;
export declare function useMUSDAllowance(): any;
export declare function useMUSDApprove(): {
    approve: (amount: bigint) => Promise<`0x${string}`>;
    isPending: boolean;
    isConfirming: boolean;
    isSuccess: boolean;
};
export declare function useMUSDTransfer(): {
    transfer: (to: `0x${string}`, amount: bigint) => Promise<`0x${string}`>;
    isPending: boolean;
    isConfirming: boolean;
    isSuccess: boolean;
};
//# sourceMappingURL=useMUSD.d.ts.map