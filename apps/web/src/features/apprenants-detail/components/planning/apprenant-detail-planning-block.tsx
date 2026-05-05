import { Button } from "@codegouvfr/react-dsfr/Button";
import clsx from "clsx";
import styles from "./apprenant-detail-planning.module.css";
import type { Block } from "./helpers/apprenant-detail-planning-utils";
import { toPct } from "./helpers/apprenant-detail-planning-utils";

export function ApprenantDetailPlanningBlock({ block }: { block: Block }) {
  const left = toPct(block.startMonth, block.startDay);
  const width = toPct(block.endMonth, block.endDay) - left;

  return (
    <div
      className={clsx(
        styles.block,
        "fr-border-radius--8 fr-flex fr-direction-column fr-align-items-center fr-justify-content-center fr-py-3v",
      )}
      style={{ left: `${left}%`, width: `${width}%`, backgroundColor: block.color }}
    >
      <span className="fr-text--bold" style={{ color: block.textColor }}>
        {block.weeks}
      </span>
      <span
        className="fr-text--bold fr-text--uppercase fr-text--xs fr-mb-0"
        style={{ color: block.textColor }}
      >
        semaines
      </span>
    </div>
  );
}

export function PlanifierButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      priority="secondary"
      iconId="fr-icon-calendar-event-line"
      size="small"
    >
      Planifier
    </Button>
  );
}
