import styles from "./Changelog.module.css";

const LOGS = [
  {
    version: "0.1.0",
    date: "May 2026",
    title: "Initial Hackathon Release",
    description: "The first public version of Mezo Checkout, built for the Supernormal dApps (MUSD Track) hackathon.",
    changes: [
      "Core `<MezoCheckout />` component with dual payment modes.",
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
          Updates and improvements to Mezo Checkout.
        </p>
      </div>

      <div className={styles.timeline}>
        {LOGS.map((log) => (
          <div key={log.version} className={styles.item}>
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
                    {change}
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
