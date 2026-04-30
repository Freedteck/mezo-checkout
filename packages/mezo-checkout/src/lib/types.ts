export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // in MUSD (1 MUSD = ~$1 USD)
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
  image: string; // Featured image for marketplace
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
  status: 0 | 1 | 2 | 3; // Pending | Funded | Completed | Cancelled
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
