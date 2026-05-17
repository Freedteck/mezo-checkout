import { Check } from "lucide-react";
import styles from "./Changelog.module.css";

const LOGS = [
  {
    version: "0.1.1",
    date: "May 2026",
    title: "Theming System & Checkout Modals",
    description: "A major update introducing modular themes, popups, and crucial checkout loading states for full production readiness.",
    changes: [
      "Light / Dark / System Themes: Fully encapsulated wrapper container with standard CSS properties for seamless integration in any client styling ecosystem.",
      "Embedded Modal Mode: Added the isModal and buttonText props to easily render payments in a premium popup modal.",
      "Transaction & Loading UX: Introduced disabled states and live UI indicators (Approving..., Opening Trove...) to guide users cleanly.",
      "Official NPM Release: Successfully published the first core build to the registry at @mezo-checkout/core@0.1.1.",
      "Obsolete Workspace Cleanup: Safely deleted the deprecated demo directory and unified the developer hub under Vite.",
    ],
  },
  {
    version: "0.1.0",
    date: "May 2026",
    title: "Initial Hackathon Release",
    description: "The first public version of Mezo Checkout, built for the Supernormal dApps (MUSD Track) hackathon.",
    changes: [
      "Core <MezoCheckout /> component with dual payment modes.",
      "Support for Pay with MUSD and Borrow & Pay (Self-Custodial Troves).",
      "Integration with Mezo Passport via RainbowKit.",
      "ShoplinkEscrow smart contract for buyer protection.",
      "Composable hooks for custom UI development.",
    ],
  },
];

export default function Changelog() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Changelog</h1>
        <p className={styles.subtitle}>
          Track releases, updates, and major upgrades to the Mezo Checkout component.
        </p>
      </div>

      <div className={styles.timeline}>
        {LOGS.map((log) => (
          <div key={log.version} className={styles.item}>
            <div className={styles.bullet} />
            
            <div className={styles.meta}>
              <span className={styles.version}>{log.version}</span>
              <span className={styles.date}>{log.date}</span>
            </div>
            
            <div className={styles.content}>
              <h2 className={styles.itemTitle}>{log.title}</h2>
              <p className={styles.description}>{log.description}</p>
              
              <ul className={styles.list} role="list">
                {log.changes.map((change, i) => (
                  <li key={i} className={styles.listItem}>
                    <Check size={14} className={styles.listItemIcon} />
                    <span>{change}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
