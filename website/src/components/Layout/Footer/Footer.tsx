import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

const LINKS = [
  {
    heading: "Product",
    items: [
      { label: "Documentation", to: "/docs" },
      { label: "Playground", to: "/playground" },
      { label: "Changelog", to: "/changelog" },
    ],
  },
  {
    heading: "Resources",
    items: [
      { label: "GitHub", href: "https://github.com/Freedteck/mezo-checkout" },
      { label: "npm", href: "https://www.npmjs.com/package/@mezo-checkout/core" },
      { label: "Mezo Docs", href: "https://docs.mezo.org" },
    ],
  },
  {
    heading: "Legal",
    items: [
      { label: "MIT License", href: "https://github.com/Freedteck/mezo-checkout/blob/main/LICENSE" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.inner}>
          {/* Brand col */}
          <div className={styles.brand}>
            <div className={styles.wordmark}>
              <img src="/logo.svg" className={styles.logoIcon} alt="Mezo Checkout Logo" />
              <span>mezo</span>
              <span className={styles.wordmarkAccent}>checkout</span>
            </div>
            <p className={styles.tagline}>
              Open-source Bitcoin-native payments for React.
            </p>
            <p className={styles.version}>
              v0.1.1 · MIT · Mezo Matsnet
            </p>
          </div>

          {/* Link columns */}
          {LINKS.map((col) => (
            <div key={col.heading} className={styles.col}>
              <p className={styles.colHeading}>{col.heading}</p>
              <ul role="list" className={styles.colList}>
                {col.items.map((item) => (
                  <li key={item.label}>
                    {"to" in item ? (
                      <Link to={item.to} className={styles.colLink}>
                        {item.label}
                      </Link>
                    ) : (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.colLink}
                      >
                        {item.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()} Mezo Checkout. Open source under MIT.
          </p>
        </div>
      </div>
    </footer>
  );
}
