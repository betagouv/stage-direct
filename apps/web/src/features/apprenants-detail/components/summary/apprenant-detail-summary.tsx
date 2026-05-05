import clsx from "clsx";
import { ApprenantFonctionBadges } from "~/features/apprenants/components/badge/apprenant-fonction-badges";
import type { FonctionStage, StatutStage } from "~/generated/prisma/enums";
import { sPluriel } from "~/utils/sPluriel";
import { computeStagesStats } from "../../helpers";
import styles from "./apprenant-detail-summary.module.css";

type Stage = {
  fonction: FonctionStage;
  statut: StatutStage;
  mds: unknown | null;
};

type Props = {
  stages: Stage[];
};

export function ApprenantDetailSummary({ stages }: Props) {
  const { termines, enCours, planifies, aPlanifier } = computeStagesStats(stages);

  return (
    <div className="fr-background-default--grey fr-border fr-mb-3w fr-overflow-hidden">
      <div className="fr-flex fr-align-items-center fr-justify-content-space-between fr-flex-wrap fr-flex-gap-4v fr-py-5v fr-px-6v fr-border-bottom">
        <h2 className="fr-h5 fr-mb-0">Parcours de stages</h2>
        <ApprenantFonctionBadges stages={stages} />
      </div>

      <div className={styles.statsGrid}>
        <div
          className={clsx(
            styles.statCell,
            "fr-flex fr-align-items-center fr-flex-gap-3v fr-py-6v fr-px-6v",
          )}
        >
          <span
            className={clsx(
              styles.statIcon,
              "fr-flex-shrink-0 fr-text-default--success fr-icon-checkbox-circle-line",
            )}
            aria-hidden="true"
          />
          <p className="fr-mb-0">
            <strong className="fr-text-title--grey">{termines}</strong> stage{sPluriel(termines)}{" "}
            terminé{sPluriel(termines)}
          </p>
        </div>

        <div
          className={clsx(
            styles.statCell,
            "fr-flex fr-align-items-center fr-flex-gap-3v fr-py-6v fr-px-6v",
          )}
        >
          <span
            className={clsx(
              styles.statIcon,
              "fr-flex-shrink-0 fr-text-default--warning ri-calendar-event-line",
            )}
            aria-hidden="true"
          />
          <p className="fr-mb-0">
            <strong className="fr-text-title--grey">{enCours}</strong> stage{sPluriel(enCours)} en
            cours
          </p>
        </div>

        <div
          className={clsx(
            styles.statCell,
            "fr-flex fr-align-items-center fr-flex-gap-3v fr-py-6v fr-px-6v",
          )}
        >
          <span
            className="fr-flex-shrink-0 fr-text-action-high--blue-france ri-calendar-2-line fr-icon--md"
            aria-hidden="true"
          />
          <p className="fr-mb-0">
            <strong className="fr-text-title--grey">{planifies}</strong> stage{sPluriel(planifies)}{" "}
            planifié{sPluriel(planifies)}
          </p>
        </div>

        <div
          className={clsx(
            styles.statCell,
            "fr-flex fr-align-items-center fr-flex-gap-3v fr-py-6v fr-px-6v",
          )}
        >
          <span
            className={clsx(
              styles.statIcon,
              "fr-flex-shrink-0 fr-text-default--error fr-icon-calendar-event-line",
            )}
            aria-hidden="true"
          />
          <p className="fr-mb-0">
            <strong className="fr-text-title--grey">{aPlanifier}</strong> stage
            {sPluriel(aPlanifier)} à planifier
          </p>
        </div>
      </div>
    </div>
  );
}
