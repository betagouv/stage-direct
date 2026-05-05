import clsx from "clsx";
import type { FonctionStage, StatutStage } from "~/generated/prisma/enums";
import { FONCTION_LABEL, FONCTIONS_ORDRE, getFonctionEtat } from "../../helpers";
import styles from "./apprenant-fonction-badges.module.css";

type Props = {
  stages: { fonction: FonctionStage; statut: StatutStage }[];
};

export function ApprenantFonctionBadges({ stages }: Props) {
  return (
    <div className="fr-flex fr-flex-wrap fr-flex-gap-2v">
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
            {etat === "VALIDE" && (
              <span className="fr-icon-check-line fr-icon--sm" aria-hidden="true" />
            )}
            {etat === "EN_COURS" && (
              <span className="ri-refresh-line fr-icon--sm" aria-hidden="true" />
            )}
            {FONCTION_LABEL[fonction]}
          </span>
        );
      })}
    </div>
  );
}
