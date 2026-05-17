import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CodeBlock from "../../../components/CodeBlock/CodeBlock";
import styles from "../Docs.module.css";

export default function HooksDocs() {
  return (
    <div className={styles.prose}>
      <h1>Core Hooks Reference</h1>
      <p className={styles.lead}>
        For complete control over the UI, use our low-level hooks. They handle contract interactions directly.
      </p>
      
      <h2>Buyer Hooks</h2>
      
      <h3><code>useMUSDBalance</code></h3>
      <p>Fetches the MUSD balance of the connected account.</p>
      <CodeBlock code={`const { raw: balance, refetch } = useMUSDBalance();`} language="tsx" />

      <h3><code>useCreateOrder</code></h3>
      <p>Locks MUSD inside the <code>ShoplinkEscrow</code> contract.</p>
      <CodeBlock code={`const { createOrder, isPending } = useCreateOrder();
// Usage: createOrder(sellerAddress, amountInWei, productId);`} language="tsx" />

      <h2>Seller Hooks</h2>

      <h3><code>useConfirmDelivery</code></h3>
      <p>Called by the <strong>Buyer</strong> to release MUSD to the Seller from the escrow.</p>
      <CodeBlock code={`const { confirmDelivery } = useConfirmDelivery();
// Usage: confirmDelivery(orderId);`} language="tsx" />

      <h3><code>useCancelOrder</code></h3>
      <p>Called by the <strong>Seller</strong> to refund MUSD to the Buyer from the escrow.</p>
      <CodeBlock code={`const { cancelOrder } = useCancelOrder();
// Usage: cancelOrder(orderId);`} language="tsx" />

      {/* ── Pagination ── */}
      <div className={styles.pagination}>
        <Link to="/docs/component" className={styles.pagBtn}>
          <ChevronLeft size={16} />
          <div>
            <span className={styles.pagLabel}>Previous</span>
            <span className={styles.pagTitle}>MezoCheckout Component</span>
          </div>
        </Link>
        <Link to="/docs/escrow-flow" className={`${styles.pagBtn} ${styles.pagBtnNext}`}>
          <div>
            <span className={styles.pagLabel}>Next</span>
            <span className={styles.pagTitle}>The Escrow Flow</span>
          </div>
          <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
