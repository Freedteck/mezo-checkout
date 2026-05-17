import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CodeBlock from "../../../components/CodeBlock/CodeBlock";
import styles from "../Docs.module.css";

const PROVIDER_CODE = `import { getConfig, mezoTestnet } from "@mezo-org/passport";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

const config = getConfig({
  appName: "My Store",
  mezoNetwork: "testnet",
});

export default function App({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={new QueryClient()}>
        <RainbowKitProvider initialChain={mezoTestnet}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}`;

export default function Providers() {
  return (
    <div className={styles.prose}>
      <h1>Providers Setup</h1>
      <p className={styles.lead}>
        Mezo Checkout requires a standard Web3 provider setup to interact with the blockchain.
      </p>
      
      <p>
        Wrap your application with <code>WagmiProvider</code> and <code>RainbowKitProvider</code>. We recommend using <code>@mezo-org/passport</code> to get the correct configuration for the Mezo network.
      </p>

      <CodeBlock code={PROVIDER_CODE} language="tsx" filename="App.tsx" />

      {/* ── Pagination ── */}
      <div className={styles.pagination}>
        <Link to="/docs/installation" className={styles.pagBtn}>
          <ChevronLeft size={16} />
          <div>
            <span className={styles.pagLabel}>Previous</span>
            <span className={styles.pagTitle}>Installation</span>
          </div>
        </Link>
        <Link to="/docs/component" className={`${styles.pagBtn} ${styles.pagBtnNext}`}>
          <div>
            <span className={styles.pagLabel}>Next</span>
            <span className={styles.pagTitle}>MezoCheckout Component</span>
          </div>
          <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
