import JusticeScales from "@codegouvfr/react-dsfr/picto/JusticeScales";
import classNames from "classnames";
import type { ReactNode } from "react";
import styles from "./auth-layout.module.css";

type AuthLayoutProps = {
  children: ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className={styles.root}>
      <aside
        className={classNames(
          styles.panel,
          "fr-flex fr-direction-column fr-justify-content-center",
        )}
      >
        <JusticeScales width={120} height={120} />
        <h1 className={styles.panelTitle}>
          Connectons les futurs magistrats à leurs lieux de formation
        </h1>
        <p
          className={classNames(
            styles.panelDescription,
            "fr-text--normal fr-text-inverted--grey fr-mb-0",
          )}
        >
          <strong>StageDirect</strong> simplifie la gestion des stages et renforce l'encadrement des
          futurs magistrats.
        </p>
      </aside>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
