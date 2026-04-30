import clsx from "clsx";
import type { FonctionStage, StatutStage } from "~/generated/prisma/enums";
import styles from "./apprenants.module.css";
import { FONCTION_LABEL, FONCTIONS_ORDRE, getFonctionEtat } from "./helpers";

type Props = {
  stages: { fonction: FonctionStage; statut: StatutStage }[];
};

export function ApprenantFonctionBadges({ stages }: Props) {
  return (
    <div className={styles.fonctionBadges}>
      {FONCTIONS_ORDRE.map((fonction) => {
        const etat = getFonctionEtat(stages, fonction);
        return (
          <span
            key={fonction}
            className={clsx(
              styles.fonctionBadge,
              etat === "VALIDE" && styles.fonctionBadgeValide,
              etat === "EN_COURS" && styles.fonctionBadgeEnCours,
            )}
          >
            {etat === "VALIDE" && <span aria-hidden="true">✓</span>}
            {etat === "EN_COURS" && <span aria-hidden="true">↻</span>}
            {FONCTION_LABEL[fonction]}
          </span>
        );
      })}
    </div>
  );
}
