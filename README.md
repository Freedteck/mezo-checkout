# MezoCheckout

Bitcoin-native payment plugin for the Mezo ecosystem.

## What is MezoCheckout?

MezoCheckout is a drop-in payment component that handles the entire Bitcoin-native payment flow invisibly. Users can pay with MUSD or borrow against their BTC collateral — without ever selling their Bitcoin.

### The Problem

Any developer building an app on Mezo that needs to accept payments has to figure out the MUSD integration themselves. They have to understand Troves, BorrowerOperations, collateral ratios, and CDP mechanics just to add a checkout button. That's a high barrier and it slows down the entire Mezo ecosystem.

### The Solution

MezoCheckout is a drop-in payment plugin that any developer can integrate into their app with minimal setup. It handles the entire Bitcoin-native payment flow invisibly — wallet connection via Mezo Passport, BTC collateral check, MUSD minting, and payment to the merchant.

## Features

- **Dual Payment Paths**: Pay with existing MUSD or atomic "Borrow & Pay" with BTC
- **Mezo Passport Integration**: Seamless wallet connection
- **Automatic Collateral Management**: Handles Troves, collateral ratios, and CDP mechanics
- **Escrow Support**: Built-in escrow contract integration
- **TypeScript Support**: Full type safety
- **Zero Configuration**: Works out of the box

## Project Structure

```
mezo-checkout/
├── packages/
│   └── mezo-checkout/          # Reusable plugin
│       ├── src/
│       │   ├── components/
│       │   │   └── MezoCheckout.tsx
│       │   ├── hooks/
│       │   │   ├── useMUSD.ts
│       │   │   ├── useEscrow.ts
│       │   │   └── useRouter.ts
│       │   ├── lib/
│       │   │   ├── contracts/
│       │   │   │   └── addresses.ts
│       │   │   ├── abis/
│       │   │   │   └── index.ts
│       │   │   └── types.ts
│       │   └── index.ts
│       ├── package.json
│       └── README.md
├── demo/                        # Simple marketplace demo
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx
│   │   │   └── shops/[id]/page.tsx
│   │   ├── components/
│   │   │   └── marketplace/
│   │   ├── lib/
│   │   │   └── data.ts
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── package.json
└── pnpm-workspace.yaml
```

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/mezo-checkout.git
cd mezo-checkout

# Install dependencies
pnpm install

# Start the demo
pnpm dev
```

### Using the Plugin

```bash
# Build the plugin
pnpm build:plugin

# Install in your project
npm install @mezo-checkout/core
```

```tsx
import { MezoCheckout } from "@mezo-checkout/core";

function ProductPage() {
  const product = {
    id: "product-123",
    name: "Premium Widget",
    description: "High-quality widget",
    price: 100,
    image: "https://example.com/widget.jpg",
  };

  const sellerAddress = "0x1234567890123456789012345678901234567890" as `0x${string}`;

  return (
    <MezoCheckout
      product={product}
      sellerAddress={sellerAddress}
      onSuccess={(orderId, txHash) => {
        console.log("Payment successful!", { orderId, txHash });
      }}
    />
  );
}
```

## Demo Marketplace

The demo marketplace showcases MezoCheckout in action:

- **3 Featured Shops**: Bitcoin Gear, Crypto Art Gallery, Tech Essentials
- **Multiple Products**: Each shop has 2-3 products
- **Live Checkout**: Test both payment paths (MUSD and Borrow & Pay)
- **Responsive Design**: Works on desktop and mobile

### Running the Demo

```bash
cd mezo-checkout
pnpm dev
```

Visit `http://localhost:3000` to see the demo.

## How It Works

### Pay with MUSD

1. User connects wallet via Mezo Passport
2. Component checks MUSD balance and allowance
3. If needed, user approves MUSD spending
4. MUSD is transferred to escrow contract
5. Order is created and confirmed

### Borrow & Pay (Atomic)

1. User connects wallet via Mezo Passport
2. Component calculates required BTC collateral
3. User sends BTC collateral with transaction
4. Mezo mints MUSD against the collateral
5. MUSD is routed to escrow contract
6. All steps happen in a single atomic transaction

## API Reference

See [packages/mezo-checkout/README.md](./packages/mezo-checkout/README.md) for full API documentation.

## Hackathon Submission

**Track**: Supernormal dApps (MUSD Track)

**Judging Criteria**:
- **Mezo Integration (30%)**: Deep integration with MUSD, Troves, CDP mechanics, Mezo Passport
- **Technical Implementation (20%)**: Working code, atomic transactions, proper hooks
- **Business Viability (30%)**: Every e-commerce app on Mezo needs this — solves real developer pain
- **User Experience (10%)**: Clean checkout UI, invisible crypto mechanics
- **Presentation Quality (10%)**: Marketplace demo proves it works end-to-end

## License

MIT

## Support

- GitHub Issues: [github.com/mezo-checkout/core](https://github.com/mezo-checkout/core)
- Mezo Documentation: [docs.mezo.org](https://docs.mezo.org)
- Discord: [discord.gg/mezo](https://discord.gg/mezo)