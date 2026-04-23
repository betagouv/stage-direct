import type { ReactNode } from "react";
import styles from "./auth-layout.module.css";

type AuthLayoutProps = {
  children: ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className={styles.root}>
      <aside className={styles.panel}>
        <h1 className={styles.panelTitle}>
          Connectons les futurs magistrats à leurs lieux de formation
        </h1>
        <p className={styles.panelText}>
          <strong>StageDirect</strong> simplifie la gestion des stages et renforce l'encadrement des
          futurs magistrats.
        </p>
      </aside>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
