import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getConfig, mezoTestnet } from "@mezo-org/passport";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import App from "./App";
import "./styles/globals.css";

const queryClient = new QueryClient();

const wagmiConfig = getConfig({
  appName: "Mezo Checkout",
  walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "3fcc6b4f13bda0c6192cdcaaa950f727",
  mezoNetwork: "testnet",
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider initialChain={mezoTestnet}>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
);
