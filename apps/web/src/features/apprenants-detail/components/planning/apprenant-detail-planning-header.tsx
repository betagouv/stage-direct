import clsx from "clsx";
import styles from "./apprenant-detail-planning.module.css";
import { MONTHS, TODAY_PCT } from "./helpers/apprenant-detail-planning-utils";

export function ApprenantDetailPlanningHeader() {
  return (
    <div className={clsx(styles.headerShadow, "fr-flex fr-border-bottom")}>
      <div
        className={clsx(
          styles.leftPanel,
          "fr-text--sm fr-mb-0 fr-border-right fr-flex fr-align-items-center fr-py-3v fr-px-4v fr-text--bold fr-text--uppercase fr-justify-content-center",
        )}
      >
        Planning
      </div>

      <div className={clsx(styles.monthsArea, "fr-flex fr-position-relative")}>
        <div className={styles.todayDot} style={{ left: `${TODAY_PCT}%` }} />
        {MONTHS.map((month, i) => (
          <div
            key={month}
            className={clsx(
              styles.monthCell,
              "fr-text--xs fr-mb-0 fr-flex fr-align-items-center fr-justify-content-center fr-py-3v fr-text--uppercase fr-text-mention--grey",
              i < MONTHS.length - 1 && "fr-border-right",
            )}
          >
            {month}
          </div>
        ))}
      </div>

      <div
        className={clsx(
          styles.evalPanel,
          "fr-border-left fr-text--xs fr-mb-0 fr-flex fr-align-items-center fr-justify-content-center fr-py-3v fr-px-3v fr-text--bold fr-text--uppercase",
        )}
      >
        Évaluations
      </div>
    </div>
  );
}
