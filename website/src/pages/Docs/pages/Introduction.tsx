import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import styles from "../Docs.module.css";

export default function Introduction() {
  return (
    <div className={styles.prose}>
      <h1>Introduction</h1>
      <p className={styles.lead}>
        Mezo Checkout is the native payment and escrow solution for the Mezo network. It allows merchants to accept Bitcoin-backed payments with zero friction.
      </p>
      
      <h2>Why Mezo Checkout?</h2>
      <p>
        Traditional crypto checkouts force users to have the exact token needed for payment. Mezo Checkout leverages the Mezo network's native capabilities to offer two distinct flows:
      </p>
      <ul>
        <li><strong>Direct MUSD Payments:</strong> For users who already hold MUSD stablecoins.</li>
        <li><strong>Borrow & Pay:</strong> For users who hold BTC. They can lock their BTC as collateral to mint MUSD on the fly to complete the purchase.</li>
      </ul>

      <h2>Core Features</h2>
      <ul>
        <li><strong>Drop-in Widget:</strong> A complete UI component that handles connection, balance checks, and payment.</li>
        <li><strong>Escrow Protection:</strong> Built-in support for the <code>ShoplinkEscrow</code> contract to protect both buyers and sellers.</li>
        <li><strong>Developer Hooks:</strong> Low-level access to the protocol for building custom UIs.</li>
      </ul>

      {/* ── Pagination ── */}
      <div className={styles.pagination}>
        <div />
        <Link to="/docs/installation" className={`${styles.pagBtn} ${styles.pagBtnNext}`}>
          <div>
            <span className={styles.pagLabel}>Next</span>
            <span className={styles.pagTitle}>Installation</span>
          </div>
          <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
