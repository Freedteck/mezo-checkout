import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import styles from "../Docs.module.css";

export default function EscrowFlow() {
  return (
    <div className={styles.prose}>
      <h1>The Escrow Flow</h1>
      <p className={styles.lead}>
        Understand the lifecycle of a secure transaction using Mezo Checkout.
      </p>
      
      <p>
        When <code>useEscrow={"{true}"}</code> is used, funds are not sent directly to the seller. Instead, they follow this lifecycle:
      </p>

      <div className={styles.flowSteps}>
        <div className={styles.flowStep}>
          <span className={styles.flowNum}>1</span>
          <div>
            <h3>Buyer Locks Funds</h3>
            <p>The buyer calls <code>createOrder()</code>. The payment amount is transferred from the buyer to the Escrow contract.</p>
          </div>
        </div>
        <div className={styles.flowStep}>
          <span className={styles.flowNum}>2</span>
          <div>
            <h3>Seller Fulfills Order</h3>
            <p>The seller sees the order in the contract and ships the physical or digital good to the buyer.</p>
          </div>
        </div>
        <div className={styles.flowStep}>
          <span className={styles.flowNum}>3</span>
          <div>
            <h3>Buyer Confirms Delivery</h3>
            <p>Upon receiving the good, the buyer calls <code>confirmDelivery()</code>. The contract releases the funds to the seller.</p>
          </div>
        </div>
      </div>

      {/* ── Pagination ── */}
      <div className={styles.pagination}>
        <Link to="/docs/hooks" className={styles.pagBtn}>
          <ChevronLeft size={16} />
          <div>
            <span className={styles.pagLabel}>Previous</span>
            <span className={styles.pagTitle}>Core Hooks Reference</span>
          </div>
        </Link>
        <div />
      </div>
    </div>
  );
}
