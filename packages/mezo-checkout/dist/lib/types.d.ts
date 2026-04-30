export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category?: string;
    stock?: number;
}
export interface Shop {
    id: string;
    name: string;
    description: string;
    owner: `0x${string}`;
    category: string;
    logo: string;
    banner: string;
    image: string;
    verified: boolean;
    rating: number;
    orders: number;
    products: Product[];
    createdAt: number;
}
export interface CartItem {
    product: Product;
    quantity: number;
}
export interface Order {
    orderId: `0x${string}`;
    buyer: `0x${string}`;
    seller: `0x${string}`;
    amount: bigint;
    status: 0 | 1 | 2 | 3;
    createdAt: bigint;
    productId: string;
}
export type OrderData = {
    hash: string;
    id: string;
    amount: string;
    customer: string;
    status: string;
    date: string;
};
//# sourceMappingURL=types.d.ts.map