import { Link, Outlet, useLocation } from "react-router-dom";
import { Book, Terminal, Settings, Layers, Code, Workflow } from "lucide-react";
import styles from "./Docs.module.css";

export default function Docs() {
  const location = useLocation();

  const pages = [
    { path: "/docs", title: "Introduction", icon: Book },
    { path: "/docs/installation", title: "Installation", icon: Terminal },
    { path: "/docs/providers", title: "Providers Setup", icon: Settings },
    { path: "/docs/component", title: "MezoCheckout Component", icon: Layers },
    { path: "/docs/hooks", title: "Core Hooks Reference", icon: Code },
    { path: "/docs/escrow-flow", title: "The Escrow Flow", icon: Workflow },
  ];

  return (
    <div className={styles.container}>
      {/* ── Sidebar ── */}
      <aside className={styles.sidebar}>
        <nav className={styles.nav} aria-label="Documentation sections">
          <p className={styles.navTitle}>Getting Started</p>
          <ul className={styles.navList} role="list">
            {pages.slice(0, 3).map((page) => (
              <li key={page.path}>
                <Link
                  to={page.path}
                  className={location.pathname === page.path ? styles.navLinkActive : styles.navLink}
                >
                  <page.icon size={14} />
                  {page.title}
                </Link>
              </li>
            ))}
          </ul>

          <p className={styles.navTitle}>Core Concepts</p>
          <ul className={styles.navList} role="list">
            {pages.slice(3).map((page) => (
              <li key={page.path}>
                <Link
                  to={page.path}
                  className={location.pathname === page.path ? styles.navLinkActive : styles.navLink}
                >
                  <page.icon size={14} />
                  {page.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* ── Main Content Area ── */}
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}
