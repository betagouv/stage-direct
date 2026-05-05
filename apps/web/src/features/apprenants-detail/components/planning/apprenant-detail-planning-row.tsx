import clsx from "clsx";
import styles from "./apprenant-detail-planning.module.css";
import { ApprenantDetailPlanningBlock, PlanifierButton } from "./apprenant-detail-planning-block";
import type { EvaluationData, PlanningItem } from "./helpers/apprenant-detail-planning-utils";
import { MONTHS, TODAY_PCT } from "./helpers/apprenant-detail-planning-utils";

function EvaluationCell({ evaluation }: { evaluation: EvaluationData | null }) {
  if (!evaluation) return null;

  if (evaluation.type === "comment") {
    return (
      <div className="fr-flex fr-align-items-center fr-flex-gap-2v fr-text-action-high--blue-france">
        <CommentIcon />
        <span className="fr-text--bold">{evaluation.count}</span>
      </div>
    );
  }

  return (
    <div className="fr-flex fr-direction-column fr-align-items-center fr-flex-gap-1v fr-text-mention--grey">
      <ClockIcon />
      <span className="fr-text--xs fr-mb-0">En attente</span>
    </div>
  );
}

export function ApprenantDetailPlanningRow({
  item,
  onPlanifier,
  className,
}: {
  item: PlanningItem;
  onPlanifier: (id: number) => void;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        styles.row,
        "fr-flex fr-background-default--grey fr-overflow-hidden fr-position-relative",
        className,
      )}
    >
      <div
        className={clsx(
          styles.leftPanel,
          "fr-border-right fr-flex fr-direction-column fr-justify-content-center fr-py-3v fr-px-4v fr-flex-gap-1v",
        )}
      >
        <span className="fr-text--bold fr-mb-0">{item.name}</span>
        <span className="fr-text--xs fr-text-mention--grey fr-mb-0">{item.dateRange}</span>
        {item.responsible && (
          <span className="fr-text--xs fr-text-mention--grey fr-mb-0">{item.responsible}</span>
        )}
      </div>

      <div className={clsx(styles.timeline, "fr-position-relative")}>
        {item.block && (
          <div className={styles.monthGrid}>
            {MONTHS.map((m, i) => (
              <div
                key={m}
                className={clsx(
                  styles.monthGridCell,
                  i < MONTHS.length - 1 && styles.monthGridCellSeparator,
                )}
              />
            ))}
          </div>
        )}
        <div className={styles.todayLine} style={{ left: `${TODAY_PCT}%` }} />
        {item.block && <ApprenantDetailPlanningBlock block={item.block} />}
      </div>

      <div
        className={clsx(
          styles.evalPanel,
          "fr-border-left fr-flex fr-align-items-center fr-justify-content-center",
        )}
      >
        <EvaluationCell evaluation={item.evaluation} />
      </div>

      {!item.block && (
        <div className={styles.planifierOverlay}>
          <PlanifierButton onClick={() => onPlanifier(item.id)} />
        </div>
      )}
    </div>
  );
}

function CommentIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
