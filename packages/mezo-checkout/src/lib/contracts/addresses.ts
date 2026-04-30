import { type Chain } from "viem";

// Mezo Testnet Chain definition
export const mezoTestnet: Chain = {
  id: 31611,
  name: "Mezo Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Bitcoin",
    symbol: "BTC",
  },
  rpcUrls: {
    default: { http: ["https://rpc.test.mezo.org"] },
    public: { http: ["https://rpc.test.mezo.org"] },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://explorer.test.mezo.org" },
  },
  testnet: true,
};

// Mezo Testnet MUSD contract address
// Source: https://docs.mezo.org/developer/contracts
export const MUSD_ADDRESS = "0x118917a40FAF1CD7a13dB0Ef56C86De7973Ac503";

// Deployed ShoplinkEscrow address (set from .env after deployment)
export const ESCROW_ADDRESS =
  (process.env.NEXT_PUBLIC_ESCROW_ADDRESS as `0x${string}`) ||
  "0xE3524C7B9c1Cb7F1A23D2724505C0C68256D20d6";

// Deployed ShoplinkRouter address — the atomic Borrow & Pay orchestrator
// Will be updated after deployment confirms
export const ROUTER_ADDRESS =
  (process.env.NEXT_PUBLIC_ROUTER_ADDRESS as `0x${string}`) ||
  "0xF3fe2368B7eC13FDb30715f113c71B960c94071F";

// Mezo Testnet BorrowerOperations address
// Found inside @mezo-org/passport/node_modules/@mezo-org/musd-contracts/deployments/matsnet/BorrowerOperations.json
export const BORROWER_OPERATIONS_ADDRESS =
  "0xCdF7028ceAB81fA0C6971208e83fa7872994beE5" as const;

// Minimum net MUSD debt when opening a trove (2000 MUSD + buffer)
export const MIN_NET_DEBT = 2000n * 10n ** 18n;

// Recommended collateralization ratio (150%)
export const RECOMMENDED_CR = 150n;

// Mezo Testnet Explorer
export const EXPLORER_URL = "https://explorer.test.mezo.org";

// Demo Parameters (for hackathon/testnet purposes)
export const DEMO_BTC_PRICE = 84000n;
