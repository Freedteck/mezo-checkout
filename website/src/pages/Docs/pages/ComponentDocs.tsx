import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CodeBlock from "../../../components/CodeBlock/CodeBlock";
import styles from "../Docs.module.css";

const COMPONENT_CODE = `import { MezoCheckout } from "@mezo-checkout/core";

function Checkout() {
  return (
    <MezoCheckout
      product={{
        id: "prod_1",
        name: "Mechanical Keyboard",
        price: 150, // in MUSD
      }}
      sellerAddress="0x1234..."
      useEscrow={true}
      isModal={false}
      buttonText="Pay with Mezo"
      theme="system"
      onSuccess={(productId, txHash) => console.log("Success", txHash)}
      onError={(error) => console.error("Error", error)}
    />
  );
}`;

export default function ComponentDocs() {
  return (
    <div className={styles.prose}>
      <h1>MezoCheckout Component</h1>
      <p className={styles.lead}>
        The fastest way to integrate Mezo payments is by using the drop-in <code>MezoCheckout</code> component.
      </p>
      
      <CodeBlock code={COMPONENT_CODE} language="tsx" filename="Checkout.tsx" />

      <h2>Props Reference</h2>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Prop</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>product</code></td>
              <td><code>Product</code></td>
              <td>The product details containing <code>id</code>, <code>name</code>, and <code>price</code>.</td>
            </tr>
            <tr>
              <td><code>sellerAddress</code></td>
              <td><code>{'0x${string}'}</code></td>
              <td>The wallet address that will receive the funds.</td>
            </tr>
            <tr>
              <td><code>useEscrow</code></td>
              <td><code>boolean</code></td>
              <td>Whether to use the escrow contract or transfer funds directly.</td>
            </tr>
            <tr>
              <td><code>isModal</code></td>
              <td><code>boolean</code></td>
              <td>If true, renders as a button that opens the checkout in a modal popup. Default is <code>false</code> (inline).</td>
            </tr>
            <tr>
              <td><code>buttonText</code></td>
              <td><code>string</code></td>
              <td>The text displayed on the trigger button when <code>isModal</code> is true. Default is "Pay with Mezo".</td>
            </tr>
            <tr>
              <td><code>theme</code></td>
              <td><code>"light" | "dark" | "system"</code></td>
              <td>Controls the component's color scheme. Default is <code>"system"</code> (OS preference).</td>
            </tr>
            <tr>
              <td><code>onSuccess</code></td>
              <td><code>(orderId, txHash) =&gt; void</code></td>
              <td>Callback fired when a payment successfully completes.</td>
            </tr>
            <tr>
              <td><code>onError</code></td>
              <td><code>(error) =&gt; void</code></td>
              <td>Callback fired when a payment fails or is rejected.</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      <div className={styles.pagination}>
        <Link to="/docs/providers" className={styles.pagBtn}>
          <ChevronLeft size={16} />
          <div>
            <span className={styles.pagLabel}>Previous</span>
            <span className={styles.pagTitle}>Providers Setup</span>
          </div>
        </Link>
        <Link to="/docs/hooks" className={`${styles.pagBtn} ${styles.pagBtnNext}`}>
          <div>
            <span className={styles.pagLabel}>Next</span>
            <span className={styles.pagTitle}>Core Hooks Reference</span>
          </div>
          <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
