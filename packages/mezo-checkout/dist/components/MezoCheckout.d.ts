import type { Product } from "../lib/types";
interface MezoCheckoutProps {
    product: Product;
    sellerAddress: `0x${string}`;
    useEscrow?: boolean;
    onSuccess?: (orderId: `0x${string}`, txHash: string) => void;
    onError?: (error: Error) => void;
}
export declare function MezoCheckout({ product, sellerAddress, useEscrow, onSuccess, onError, }: MezoCheckoutProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=MezoCheckout.d.ts.map