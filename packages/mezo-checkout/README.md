# MezoCheckout

A fully decentralized, Bitcoin-native payment plugin for the Mezo ecosystem.

With `MezoCheckout`, merchants can seamlessly accept Bitcoin-backed MUSD payments, and buyers can pay using existing MUSD or **borrow against their BTC collateral in real-time** — without ever selling their Bitcoin.

## Features

- **Self-Custodial Borrow & Pay**: Users open their own Trove and mint MUSD directly from the protocol. No custodial routers.
- **Dual Payment Modes**: Support for **Escrow Protection** (Smart Contract) or **Direct P2P Transfers**.
- **Mezo Passport Integration**: Flawless wallet connection via RainbowKit and Wagmi.
- **Zero Configuration**: A beautifully styled, drop-in React component ready for production.

## Installation

```bash
npm install @mezo-checkout/core
# or
pnpm add @mezo-checkout/core
# or
yarn add @mezo-checkout/core
```

## Quick Start

### 1. Wrap Your App

You must wrap your application with `Wagmi` and `RainbowKit` pointing to the Mezo Testnet.

```tsx
import { WagmiConfig } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { mezoTestnet } from "@mezo-checkout/core";

const queryClient = new QueryClient();

const config = {
  chains: [mezoTestnet],
  ssr: true,
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={config}>
        <RainbowKitProvider>
          <YourApp />
        </RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
}
```

### 2. Drop In The Checkout Modal

Import the `MezoCheckout` component into your marketplace or product page.

```tsx
import { MezoCheckout } from "@mezo-checkout/core";

function ProductPage() {
  const product = {
    id: "prod_1",
    name: "Limited Edition Jacket",
    description: "Exclusive physical merch",
    price: 50,
    image: "https://example.com/jacket.jpg",
  };

  const SELLER_WALLET = "0xYourMerchantAddress";

  return (
    <MezoCheckout
      product={product}
      sellerAddress={SELLER_WALLET}
      useEscrow={true} // Set to false for instant P2P transfer!
      onSuccess={(productId, txHash) => {
        console.log("Success!", txHash);
      }}
    />
  );
}
```

## Advanced API Reference

If you want to build your own custom UI, you can import our underlying React hooks.

### Core Hooks

```tsx
import {
  useMUSDBalance,
  useMUSDApprove,
  useMUSDTransfer,
  useOpenTrove,
  useCreateOrder,
  useConfirmDelivery,
  useCancelOrder,
} from "@mezo-checkout/core";
```

- **`useOpenTrove`**: Locks BTC and mints MUSD directly from the Mezo Protocol. (Enforces the 1,800 MUSD principal floor).
- **`useMUSDTransfer`**: Directly transfers MUSD to a destination wallet (No Escrow).
- **`useCreateOrder`**: Locks MUSD inside the `ShoplinkEscrow` smart contract.
- **`useConfirmDelivery`**: Called by the **Buyer** to release MUSD to the Seller.
- **`useCancelOrder`**: Called by the **Seller** to refund MUSD to the Buyer.

## The Escrow Flow

When `useEscrow={true}` is passed to `<MezoCheckout>`, the plugin uses the `ShoplinkEscrow` contract to protect both parties:

1. Buyer locks MUSD into the Escrow contract.
2. Seller ships the physical/digital good.
3. Buyer calls `confirmDelivery(orderId)` to release the funds.
4. If out of stock, Seller calls `cancelOrder(orderId)` to refund the buyer.

## Custom Smart Contracts

If you deployed your own `ShoplinkEscrow` contract, you can override the default address using environment variables:

```env
NEXT_PUBLIC_ESCROW_ADDRESS=0xYourCustomEscrowAddress
```

## Network

Currently designed and tested exclusively on the **Mezo Matsnet Testnet**.

## Support

- GitHub Issues: [github.com/Freedteck/mezo-checkout/issues](https://github.com/Freedteck/mezo-checkout/issues)
- Mezo Documentation: [docs.mezo.org](https://docs.mezo.org)
