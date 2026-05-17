import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CodeBlock from "../../../components/CodeBlock/CodeBlock";
import styles from "../Docs.module.css";

export default function Installation() {
  return (
    <div className={styles.prose}>
      <h1>Installation</h1>
      <p className={styles.lead}>
        Get started by installing the core package and its peer dependencies.
      </p>
      
      <p>
        The package is officially published on the NPM registry at{" "}
        <a
          href="https://www.npmjs.com/package/@mezo-checkout/core"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--accent)", textDecoration: "underline" }}
        >
          npmjs.com/package/@mezo-checkout/core
        </a>.
      </p>
      
      <p>Install the package via your preferred package manager:</p>
      <CodeBlock code={`pnpm add @mezo-checkout/core`} language="bash" />

      <h2>Peer Dependencies</h2>
      <p>
        Mezo Checkout relies on Wagmi and RainbowKit for wallet interactions. Ensure you have them installed in your project:
      </p>
      <CodeBlock code={`pnpm add wagmi viem @rainbow-me/rainbowkit @tanstack/react-query`} language="bash" />

      {/* ── Pagination ── */}
      <div className={styles.pagination}>
        <Link to="/docs" className={styles.pagBtn}>
          <ChevronLeft size={16} />
          <div>
            <span className={styles.pagLabel}>Previous</span>
            <span className={styles.pagTitle}>Introduction</span>
          </div>
        </Link>
        <Link to="/docs/providers" className={`${styles.pagBtn} ${styles.pagBtnNext}`}>
          <div>
            <span className={styles.pagLabel}>Next</span>
            <span className={styles.pagTitle}>Providers Setup</span>
          </div>
          <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
