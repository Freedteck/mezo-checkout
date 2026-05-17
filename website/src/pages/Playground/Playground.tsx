import { useState, useEffect } from "react";
import {
  MezoCheckout,
  useMUSDBalance,
  useMUSDApprove,
  useMUSDTransfer,
  useOpenTrove,
  useCreateOrder,
  useConfirmDelivery,
  useCancelOrder,
} from "@mezo-checkout/core";
import {
  Code,
  Terminal,
  Settings,
  Layers,
  Wallet,
  Bitcoin,
  ArrowRight,
  ShieldCheck,
  X,
} from "lucide-react";
import { useAccount } from "wagmi";
import { formatUnits, parseUnits } from "viem";
import CodeBlock from "../../components/CodeBlock/CodeBlock";
import styles from "./Playground.module.css";

type MethodId =
  | "component-inline"
  | "component-modal"
  | "balance"
  | "approve"
  | "transfer"
  | "trove"
  | "create-order"
  | "confirm"
  | "cancel";

export default function Playground() {
  const { isConnected } = useAccount();
  const [activeMethod, setActiveMethod] =
    useState<MethodId>("component-inline");
  const [logs, setLogs] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [price, setPrice] = useState(120);
  const [sellerAddress, setSellerAddress] = useState(
    "0x1234567890123456789012345678901234567890",
  );
  const [orderId, setOrderId] = useState("0x7fe8a2b...901c");
  const [useEscrow, setUseEscrow] = useState(true);

  // Initialize with the current website theme
  const [compTheme, setCompTheme] = useState<"system" | "light" | "dark">(
    (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') as any) || "dark"
  );

  // Listen for website theme changes
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          const newTheme = document.documentElement.getAttribute('data-theme');
          if (newTheme === 'light' || newTheme === 'dark') {
            setCompTheme(newTheme);
          }
        }
      });
    });
    
    if (typeof document !== 'undefined') {
      observer.observe(document.documentElement, { attributes: true });
    }
    
    return () => observer.disconnect();
  }, []);

  const addLog = (message: string) => {
    setLogs((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] ${message}`,
    ]);
  };

  const { raw: balance } = useMUSDBalance();

  const methods = [
    {
      id: "component-inline",
      title: "Component (Inline)",
      category: "Drop-in UI",
    },
    {
      id: "component-modal",
      title: "Component (Modal)",
      category: "Drop-in UI",
    },
    { id: "balance", title: "Get Balance", category: "Wallet" },
    { id: "approve", title: "Approve MUSD", category: "Wallet" },
    { id: "transfer", title: "Direct Transfer", category: "Payments" },
    { id: "trove", title: "Open Trove (BTC)", category: "Borrowing" },
    { id: "create-order", title: "Create Escrow Order", category: "Escrow" },
    { id: "confirm", title: "Confirm Delivery", category: "Escrow" },
    { id: "cancel", title: "Cancel Order", category: "Escrow" },
  ];

  const getMethodDescription = (id: MethodId) => {
    switch (id) {
      case "component-inline": return "The complete checkout experience embedded directly in your page. Handles wallet connection, balance checks, and payment flows.";
      case "component-modal": return "The checkout experience triggered as a popup modal. Great for keeping users on your page until they are ready to pay.";
      case "balance": return "Reads the user's MUSD balance on the Mezo network.";
      case "approve": return "Approves the checkout contract to spend the user's MUSD. Required before creating an escrow order.";
      case "transfer": return "Performs a direct transfer of MUSD from the user to the seller without using the escrow contract.";
      case "trove": return "Locks Bitcoin collateral to mint equivalent MUSD. Enforces the protocol's minimum debt floor.";
      case "create-order": return "Locks MUSD in the escrow contract and creates a trackable order. Funds are held until delivery.";
      case "confirm": return "Called by the buyer to release the locked escrow funds to the seller after receiving the goods.";
      case "cancel": return "Called by the seller to refund the locked escrow funds back to the buyer.";
      default: return "";
    }
  };

  const getCodeSnippet = (id: MethodId) => {
    switch (id) {
      case "component-inline":
        return `import { MezoCheckout } from "@mezo-checkout/core";

export default function Page() {
  return (
    <MezoCheckout
      product={{ 
        id: "prod_1", 
        name: "Premium Widget", 
        price: ${price},
        description: "Awesome mechanical keyboard",
        image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=200&h=200&fit=crop"
      }}
      sellerAddress="${sellerAddress}"
      useEscrow={${useEscrow}}
      theme="${compTheme}"
    />
  );
}`;
      case "component-modal":
        return `import { MezoCheckout } from "@mezo-checkout/core";

export default function Page() {
  return (
    <MezoCheckout
      product={{ 
        id: "prod_1", 
        name: "Premium Widget", 
        price: ${price},
        description: "Awesome mechanical keyboard",
        image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=200&h=200&fit=crop"
      }}
      sellerAddress="${sellerAddress}"
      isModal={true}
      buttonText="Pay with Mezo"
      useEscrow={${useEscrow}}
      theme="${compTheme}"
    />
  );
}`;
      case "balance":
        return `import { useMUSDBalance } from "@mezo-checkout/core";
import { formatUnits } from "viem";

const { raw: balance } = useMUSDBalance();
console.log("Balance:", balance ? formatUnits(balance, 18) : "0");`;
      case "approve":
        return `import { useMUSDApprove } from "@mezo-checkout/core";
import { parseUnits } from "viem";

const { approve } = useMUSDApprove();
await approve(parseUnits("${price}", 18));`;
      case "transfer":
        return `import { useMUSDTransfer } from "@mezo-checkout/core";
import { parseUnits } from "viem";

const { transfer } = useMUSDTransfer();
await transfer("${sellerAddress}", parseUnits("${price}", 18));`;
      case "trove":
        return `import { useOpenTrove } from "@mezo-checkout/core";

const { openTrove } = useOpenTrove();
// Locks BTC to mint equivalent MUSD
await openTrove(parseUnits("${price}", 18), 0.045);`;
      case "create-order":
        return `import { useCreateOrder } from "@mezo-checkout/core";

const { createOrder } = useCreateOrder();
await createOrder("${sellerAddress}", parseUnits("${price}", 18), "prod_1");`;
      case "confirm":
        return `import { useConfirmDelivery } from "@mezo-checkout/core";

const { confirmDelivery } = useConfirmDelivery();
await confirmDelivery("${orderId}");`;
      case "cancel":
        return `import { useCancelOrder } from "@mezo-checkout/core";

const { cancelOrder } = useCancelOrder();
await cancelOrder("${orderId}");`;
      default:
        return "";
    }
  };

  return (
    <div className={styles.container}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Feature Explorer</h1>
          <p className={styles.subtitle}>
            Interact with every method and hook in the package.
          </p>
        </div>
      </div>

      {/* ── Workspace ── */}
      <div className={styles.workspaceGrid}>
        {/* ── Sidebar: Method List ── */}
        <div className={styles.methodSidebar}>
          {["Drop-in UI", "Wallet", "Payments", "Borrowing", "Escrow"].map(
            (category) => (
              <div key={category} className={styles.categoryGroup}>
                <p className={styles.categoryTitle}>{category}</p>
                {methods
                  .filter((m) => m.category === category)
                  .map((method) => (
                    <button
                      key={method.id}
                      className={
                        activeMethod === method.id
                          ? styles.methodBtnActive
                          : styles.methodBtn
                      }
                      onClick={() => setActiveMethod(method.id as MethodId)}
                    >
                      {method.title}
                    </button>
                  ))}
              </div>
            ),
          )}
        </div>

        {/* ── Center: Interactive Canvas ── */}
        <div className={styles.centerCanvas}>
          <div
            className={styles.canvasHeader}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Layers size={14} />
              <span>Interactive Preview</span>
            </div>
            {(activeMethod === "component-inline" ||
              activeMethod === "component-modal") && (
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "12px",
                    cursor: "pointer",
                    color: "var(--text-secondary)",
                  }}
                >
                  Theme:
                  <select
                    value={compTheme}
                    onChange={(e) => setCompTheme(e.target.value as any)}
                    style={{
                      background: "var(--bg-elevated)",
                      color: "var(--text-primary)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-sm)",
                      padding: "2px 4px",
                      fontSize: "12px",
                    }}
                  >
                    <option value="system">System</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </label>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "12px",
                    cursor: "pointer",
                    color: "var(--text-secondary)",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={useEscrow}
                    onChange={(e) => setUseEscrow(e.target.checked)}
                  />
                  <span>Use Escrow</span>
                </label>
              </div>
            )}
          </div>

          <div className={styles.methodDescBox}>
            <p className={styles.methodDescText}>
              {getMethodDescription(activeMethod)}
            </p>
          </div>

          <div className={styles.canvasContent}>
            {activeMethod === "component-inline" && (
              <div className={styles.previewBox}>
                <MezoCheckout
                  product={{
                    id: "prod_1",
                    name: "Premium Widget",
                    price,
                    description: "Awesome mechanical keyboard",
                    image:
                      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=200&h=200&fit=crop",
                  }}
                  sellerAddress={sellerAddress as `0x${string}`}
                  useEscrow={useEscrow}
                  theme={compTheme}
                />
              </div>
            )}

            {activeMethod === "component-modal" && (
              <div className={styles.previewBox}>
                <MezoCheckout
                  product={{
                    id: "prod_1",
                    name: "Premium Widget",
                    price,
                    description: "Awesome mechanical keyboard",
                    image:
                      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=200&h=200&fit=crop",
                  }}
                  sellerAddress={sellerAddress as `0x${string}`}
                  isModal={true}
                  buttonText="Pay with Mezo"
                  useEscrow={useEscrow}
                  theme={compTheme}
                />
              </div>
            )}

            {activeMethod === "balance" && (
              <div className={styles.formCard}>
                <h3>Your MUSD Balance</h3>
                <p className={styles.formValue}>
                  {balance
                    ? parseFloat(formatUnits(balance, 18)).toFixed(2)
                    : "0.00"}{" "}
                  MUSD
                </p>
                <button
                  className={styles.customBtn}
                  onClick={() => addLog("Refetching balance...")}
                >
                  Refetch
                </button>
              </div>
            )}

            {(activeMethod === "approve" ||
              activeMethod === "transfer" ||
              activeMethod === "create-order" ||
              activeMethod === "trove") && (
              <div className={styles.formCard}>
                <h3>Execute Method</h3>
                <div className={styles.formRow}>
                  <label>Price (MUSD)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                  />
                </div>
                <div className={styles.formRow}>
                  <label>Seller Address</label>
                  <input
                    type="text"
                    value={sellerAddress}
                    onChange={(e) => setSellerAddress(e.target.value)}
                  />
                </div>
                <button
                  className={styles.customBtn}
                  onClick={() => addLog(`Executing ${activeMethod}...`)}
                >
                  Run Method
                </button>
              </div>
            )}

            {(activeMethod === "confirm" || activeMethod === "cancel") && (
              <div className={styles.formCard}>
                <h3>Escrow Action</h3>
                <div className={styles.formRow}>
                  <label>Order ID</label>
                  <input
                    type="text"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                  />
                </div>
                <button
                  className={styles.customBtn}
                  onClick={() =>
                    addLog(`Executing ${activeMethod} for order ${orderId}`)
                  }
                >
                  Submit Action
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Right Pane: Code & Logs ── */}
        <div className={styles.rightPane}>
          <div className={styles.codeSection}>
            <CodeBlock
              code={getCodeSnippet(activeMethod)}
              language="tsx"
              filename={`${activeMethod}.tsx`}
            />
          </div>

          <div className={styles.logsSection}>
            <div className={styles.barTitle}>
              <Terminal size={14} />
              <span>Output / Logs</span>
            </div>
            <div className={styles.logs}>
              {logs.length === 0 ? (
                <p className={styles.emptyLogs}>
                  Execute a method to see output logs.
                </p>
              ) : (
                logs.map((log, i) => (
                  <p key={i} className={styles.logItem}>
                    {log}
                  </p>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
