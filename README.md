# 🟠 MezoCheckout 

![MezoCheckout Banner](https://img.shields.io/badge/Mezo-Checkout-orange?style=for-the-badge&logo=bitcoin)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Solidity](https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white)

A fully decentralized, Bitcoin-native payment plugin built exclusively for the Mezo ecosystem. 

With `MezoCheckout`, merchants can seamlessly accept Bitcoin-backed MUSD payments, and buyers can pay using existing MUSD or **borrow against their BTC collateral in real-time** — without ever selling their Bitcoin.

---

## 🏆 Hackathon Submission

**Track**: Supernormal dApps (MUSD Track)

### Why we built this
Any developer building an e-commerce or SaaS app on Mezo currently has to figure out the MUSD integration themselves. They have to understand Troves, BorrowerOperations, collateral ratios, and CDP mechanics just to add a simple checkout button. That's a massive barrier to entry.

`MezoCheckout` solves this. It is a drop-in React component that handles the entire Bitcoin-native payment flow invisibly. It enables instant self-custodial MUSD minting and direct checkout in under 5 minutes of developer setup.

---

## ⚡ Features

- **Self-Custodial Borrow & Pay**: Users open their own Trove and mint MUSD directly from the Mezo Protocol. No custodial routers.
- **Dual Payment Modes**: Support for **Escrow Protection** (Smart Contract) or **Direct P2P Transfers**.
- **Mezo Passport Integration**: Flawless wallet connection via RainbowKit and Wagmi.
- **Theming Support**: Includes dynamic light/dark mode ("system" default) adapting to your app.
- **Zero Configuration**: A beautifully styled, drop-in React component ready for production.

---

## 🏗️ Monorepo Architecture

This repository is a `pnpm` workspace containing three core packages:

```text
mezo-checkout/
├── packages/
│   └── mezo-checkout/     # The @mezo-checkout/core NPM plugin
├── website/               # The Developer Landing Page, Interactive Docs & Playground
└── contracts/             # Hardhat environment for the ShoplinkEscrow Smart Contract
```

---

## 🚀 Quick Start (Playground & Docs)

Want to see the plugin in action and read the comprehensive interactive documentation? Run the Developer Hub locally!

```bash
# 1. Clone the repository
git clone https://github.com/Freedteck/mezo-checkout.git
cd mezo-checkout

# 2. Install workspace dependencies
pnpm install

# 3. Start the Developer Hub
pnpm dev
```
Visit `http://localhost:3001` to test the Live Playground and view the dynamic integration docs!

---

## 💻 Developer Installation

If you want to use the plugin in your own application:

```bash
npm install @mezo-checkout/core
```

```tsx
import { MezoCheckout } from "@mezo-checkout/core";

export default function CheckoutPage() {
  return (
    <MezoCheckout
      product={{ id: "1", price: 50, name: "Premium Widget" }}
      sellerAddress="0xYourWalletAddress"
      useEscrow={true} // Set to false for instant P2P transfer!
      isModal={false}  // Set to true to render as a popup button
      theme="system"   // Options: "light", "dark", or "system" (default)
      onSuccess={(productId, txHash) => console.log("Success!", txHash)}
    />
  );
}
```
*For full API documentation, see [packages/mezo-checkout/README.md](./packages/mezo-checkout/README.md)*

---

## 🤝 Support & Contributing

- **Report a Bug**: [github.com/Freedteck/mezo-checkout/issues](https://github.com/Freedteck/mezo-checkout/issues)
- **Mezo Documentation**: [docs.mezo.org](https://docs.mezo.org)

### License
MIT