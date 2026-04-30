export type OrderData = {
    hash: string;
    id: string;
    amount: string;
    customer: string;
    status: string;
    date: string;
};
export declare function useOrders(): {
    orderHashes: string[];
    addOrder: (hash: string) => void;
};
export declare function useDashboardOrders(hashes: string[]): {
    id: string;
    customer: string;
    status: string;
    amount: string;
    hash: string;
    date: string;
}[];
//# sourceMappingURL=useOrders.d.ts.map