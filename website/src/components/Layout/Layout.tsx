import { type ReactNode } from "react";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import styles from "./Layout.module.css";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.shell}>
      <Navbar />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
}
