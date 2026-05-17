import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Code2,
  Layers,
  ArrowUpRight,
  Lock,
  Repeat2,
  Wallet,
  ShoppingCart,
  Globe,
  RefreshCw,
  HelpCircle,
  Check,
  Bitcoin,
  ChevronRight,
} from "lucide-react";
import { MezoCheckout } from "@mezo-checkout/core";
import CodeBlock from "../../components/CodeBlock/CodeBlock";
import styles from "./Home.module.css";

const INSTALL_CMD = `npm install @mezo-checkout/core`;

const COMPONENT_SNIPPET = `import { MezoCheckout } from "@mezo-checkout/core";

export default function ProductPage() {
  return (
    <MezoCheckout
      product={{ id: "prod_001", name: "Keyboard", price: 120 }}
      sellerAddress="0xYourMerchantWalletAddress"
      useEscrow={true}
      onSuccess={(productId, txHash) => console.log("Paid!")}
    />
  );
}`;

const FEATURES = [
  {
    icon: Wallet,
    title: "Pay with MUSD",
    body: "Buyers with existing MUSD balance pay directly — one approval, one transaction. Escrow-protected or instant peer-to-peer, your choice.",
  },
  {
    icon: Layers,
    title: "Borrow & Pay",
    body: "No MUSD balance? Buyers lock BTC to open a self-custodial Trove and mint MUSD on the spot. They pay without selling a single sat.",
  },
  {
    icon: Lock,
    title: "Escrow Protection",
    body: "Funds are held inside the ShoplinkEscrow contract until the buyer confirms delivery. Either party can cancel and trigger a full refund.",
  },
];

const USE_CASES = [
  {
    icon: ShoppingCart,
    title: "E-Commerce",
    body: "Drop the checkout button into your store. Support physical goods with built-in escrow protection for buyer trust.",
  },
  {
    icon: Globe,
    title: "SaaS & Digital Goods",
    body: "Accept instant payments for software, API access, or digital downloads using the direct transfer mode.",
  },
  {
    icon: RefreshCw,
    title: "P2P Marketplaces",
    body: "Build decentralized marketplaces where buyers and sellers transact directly, backed by trustless smart contract escrows.",
  },
];

const FAQS = [
  {
    q: "Is Mezo Checkout self-custodial?",
    a: "Yes. Mezo Checkout never holds your funds. When borrowing, users open their own Trove directly on the Mezo protocol. When paying via escrow, funds are held in a transparent smart contract, not by us.",
  },
  {
    q: "What networks are supported?",
    a: "Currently, Mezo Checkout is live on the Mezo Matsnet testnet. Mainnet support will follow the official Mezo mainnet launch.",
  },
  {
    q: "Do users need BTC to pay?",
    a: "If users have MUSD in their wallet, they can pay directly. If they only have BTC, the 'Borrow & Pay' feature allows them to lock BTC as collateral to mint the required MUSD automatically in the same flow.",
  },
  {
    q: "How are refunds handled?",
    a: "In escrow mode, if an order is cancelled by the seller (e.g., out of stock), funds are returned to the buyer's wallet immediately via the smart contract.",
  },
];

export default function Home() {
  return (
    <div className={styles.page}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroInner}>
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>
                The Bitcoin-Native<br />Payment Gateway.
              </h1>
              <p className={styles.heroSubtitle}>
                Accept MUSD payments on Mezo with zero friction. Enable your users to pay with existing stablecoins or borrow against their BTC in real-time. No custodians, no complex setups.
              </p>

              <div className={styles.heroCtas}>
                <Link to="/docs" className={styles.ctaPrimary}>
                  Start Integration
                  <ArrowRight size={16} />
                </Link>
                <Link to="/playground" className={styles.ctaSecondary}>
                  Try Live Demo
                </Link>
              </div>

              <div className={styles.heroInstall}>
                <CodeBlock
                  code={INSTALL_CMD}
                  language="bash"
                  filename="Terminal"
                />
              </div>
            </div>

            <div className={styles.heroVisual}>
              <div className={styles.mockupWrapper}>
                <div className={styles.staticMockup}>
                  <div className={styles.mockupHeader}>
                    <div className={styles.mockupProduct}>
                      <img src="https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=200&h=200&fit=crop" alt="Product" className={styles.mockupImg} />
                      <div>
                        <p className={styles.mockupName}>Premium Widget</p>
                        <p className={styles.mockupDesc}>Awesome mechanical keyboard</p>
                      </div>
                    </div>
                    <div className={styles.mockupTotal}>
                      <span>Total</span>
                      <span className={styles.mockupValue}>120 MUSD</span>
                    </div>
                  </div>

                  <div className={styles.mockupOption}>
                    <div className={styles.mockupOptionLeft}>
                      <Wallet size={20} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                      <div>
                        <p className={styles.mockupOptionTitle}>Pay with MUSD</p>
                        <p className={styles.mockupOptionSub}>Pay directly using your balance</p>
                      </div>
                    </div>
                    <ChevronRight size={16} color="rgba(255, 255, 255, 0.5)" />
                  </div>

                  <div className={styles.mockupOption}>
                    <div className={styles.mockupOptionLeft}>
                      <Bitcoin size={20} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                      <div>
                        <p className={styles.mockupOptionTitle}>
                          Borrow & Pay
                          <span className={styles.mockupBadge}>Self-Custodial</span>
                        </p>
                        <p className={styles.mockupOptionSub}>Mint MUSD against BTC & pay</p>
                      </div>
                    </div>
                    <ChevronRight size={16} color="#0066ff" />
                  </div>

                  <p className={styles.mockupPowered}>Powered by Mezo · Bitcoin-backed MUSD</p>
                </div>
              </div>
              <div className={styles.glowEffect} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Tech Specs Bar ── */}
      <section className={styles.contextBar}>
        <div className="container">
          <ul className={styles.contextList} role="list">
            <li className={styles.contextItem}>
              <Code2 size={15} className={styles.contextIcon} />
              <span>TypeScript Native</span>
            </li>
            <li className={styles.contextDivider} aria-hidden="true" />
            <li className={styles.contextItem}>
              <Layers size={15} className={styles.contextIcon} />
              <span>React 18+ Supported</span>
            </li>
            <li className={styles.contextDivider} aria-hidden="true" />
            <li className={styles.contextItem}>
              <Zap size={15} className={styles.contextIcon} />
              <span>Zero Configuration</span>
            </li>
            <li className={styles.contextDivider} aria-hidden="true" />
            <li className={styles.contextItem}>
              <Globe size={15} className={styles.contextIcon} />
              <span>Mezo Matsnet</span>
            </li>
          </ul>
        </div>
      </section>

      {/* ── Core Features ── */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Built for modern commerce</h2>
            <p className={styles.sectionSubtitle}>
              Every feature your users need to transact confidently on the Bitcoin layer.
            </p>
          </div>
          <ul className={styles.features} role="list">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <li key={title} className={styles.feature}>
                <div className={styles.featureIcon}>
                  <Icon size={18} />
                </div>
                <div>
                  <h3 className={styles.featureTitle}>{title}</h3>
                  <p className={styles.featureBody}>{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Use Cases ── */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Fits your business</h2>
            <p className={styles.sectionSubtitle}>
              Whether you are shipping physical goods or selling digital assets, we have a flow for you.
            </p>
          </div>
          <ul className={styles.features} role="list">
            {USE_CASES.map(({ icon: Icon, title, body }) => (
              <li key={title} className={styles.feature}>
                <div className={styles.featureIcon}>
                  <Icon size={18} />
                </div>
                <div>
                  <h3 className={styles.featureTitle}>{title}</h3>
                  <p className={styles.featureBody}>{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Trust & Security ── */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.trustBlock}>
            <div className={styles.trustHeader}>
              <ShieldCheck size={32} className={styles.trustIcon} />
              <h2 className={styles.sectionTitle}>Bank on Code, Not Custodians</h2>
              <p className={styles.sectionSubtitle}>
                Mezo Checkout is built on the principle of self-custody. We never touch your funds, and neither does any third party.
              </p>
            </div>
            
            <div className={styles.trustGrid}>
              <div className={styles.trustItem}>
                <Check size={16} className={styles.checkIcon} />
                <div>
                  <h3>Direct Protocol Interaction</h3>
                  <p>Borrowing flows interact directly with the Mezo Protocol smart contracts. Your collateral remains in your custody.</p>
                </div>
              </div>
              <div className={styles.trustItem}>
                <Check size={16} className={styles.checkIcon} />
                <div>
                  <h3>Immutable Escrow</h3>
                  <p>The ShoplinkEscrow contract enforces that funds can only move to the seller upon buyer confirmation or back to the buyer on cancellation.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Code Section ── */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className="container">
          <div className={styles.codeSection}>
            <div className={styles.codeSectionText}>
              <p className={styles.eyebrow}>Drop-in UI</p>
              <h2 className={styles.sectionTitle}>Integrates in minutes</h2>
              <p className={styles.sectionSubtitle}>
                No need to spend weeks understanding CDPs or payment rails. Import the component, pass the product details, and you are ready to accept Bitcoin payments.
              </p>
              <Link to="/docs" className={styles.inlineLink}>
                View Documentation <ArrowRight size={14} />
              </Link>
            </div>
            <div className={styles.codeSectionBlock}>
              <CodeBlock
                code={COMPONENT_SNIPPET}
                language="tsx"
                filename="Checkout.tsx"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
            <p className={styles.sectionSubtitle}>
              Quick answers to common questions about Mezo Checkout.
            </p>
          </div>

          <div className={styles.faqGrid}>
            {FAQS.map((faq, i) => (
              <div key={i} className={styles.faqItem}>
                <HelpCircle size={16} className={styles.faqIcon} />
                <div>
                  <h3 className={styles.faqQuestion}>{faq.q}</h3>
                  <p className={styles.faqAnswer}>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaBlock}>
            <h2 className={styles.ctaTitle}>Start building the future of Bitcoin commerce</h2>
            <p className={styles.ctaBody}>
              Integrate Mezo Checkout today. Open source and MIT licensed.
            </p>
            <div className={styles.ctaActions}>
              <Link to="/docs" className={styles.ctaPrimary}>
                Get Started
                <ArrowRight size={16} />
              </Link>
              <a
                href="https://github.com/Freedteck/mezo-checkout"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.ctaGithub}
              >
                View on GitHub
                <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
