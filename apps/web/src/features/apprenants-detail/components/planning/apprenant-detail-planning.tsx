import { useState } from "react";
import { ApprenantDetailPlanningHeader } from "./apprenant-detail-planning-header";
import { ApprenantDetailPlanningRow } from "./apprenant-detail-planning-row";
import type { PlanningItem } from "./helpers/apprenant-detail-planning-utils";

const planningData: PlanningItem[] = [
  {
    id: 1,
    name: "Parquet",
    dateRange: "11 jan. → 22 fév.",
    responsible: "Mme Aubert",
    block: {
      startMonth: 1,
      startDay: 11,
      endMonth: 2,
      endDay: 22,
      weeks: 6,
      color: "#C8E6C9",
      textColor: "#2E7D32",
    },
    evaluation: { type: "comment", count: 1 },
  },
  {
    id: 2,
    name: "Instruction",
    dateRange: "11 jan. → 22 fév.",
    responsible: "M. Richard",
    block: {
      startMonth: 2,
      startDay: 1,
      endMonth: 3,
      endDay: 1,
      weeks: 4,
      color: "#DCEDC8",
      textColor: "#558B2F",
    },
    evaluation: { type: "pending" },
  },
  {
    id: 3,
    name: "JAF",
    dateRange: "27 mars → 24 avril",
    responsible: "M. Mangiaret",
    block: {
      startMonth: 3,
      startDay: 20,
      endMonth: 4,
      endDay: 24,
      weeks: 5,
      color: "#F5E6C8",
      textColor: "#8D6E63",
    },
    evaluation: null,
  },
  {
    id: 4,
    name: "JAP",
    dateRange: "27 mars → 24 avril",
    responsible: "M. Mangiaret",
    block: {
      startMonth: 4,
      startDay: 25,
      endMonth: 6,
      endDay: 17,
      weeks: 7,
      color: "#EAE2D6",
      textColor: "#78706A",
    },
    evaluation: null,
  },
  {
    id: 5,
    name: "JCP",
    dateRange: "27 mars → 24 avril",
    responsible: "M. Mangiaret",
    block: {
      startMonth: 5,
      startDay: 20,
      endMonth: 6,
      endDay: 17,
      weeks: 4,
      color: "#EAE2D6",
      textColor: "#78706A",
    },
    evaluation: null,
  },
  {
    id: 6,
    name: "JE",
    dateRange: "27 mars → 24 avril",
    responsible: "M. Mangiaret",
    block: {
      startMonth: 7,
      startDay: 1,
      endMonth: 8,
      endDay: 11,
      weeks: 5,
      color: "#EAE2D6",
      textColor: "#78706A",
    },
    evaluation: null,
  },
  {
    id: 7,
    name: "Pénal",
    dateRange: "À planifier",
    responsible: null,
    block: null,
    evaluation: null,
  },
  {
    id: 8,
    name: "Civil",
    dateRange: "À planifier",
    responsible: null,
    block: null,
    evaluation: null,
  },
];

export function ApprenantDetailPlanning() {
  const [items] = useState<PlanningItem[]>(planningData);

  function handlePlanifier(id: number) {
    alert(`Planifier item #${id}`);
  }

  return (
    <div className="fr-border fr-background-default--grey" style={{ overflowX: "auto" }}>
      <div style={{ minWidth: 900 }}>
        <ApprenantDetailPlanningHeader />
        {items.map((item, i) => (
          <ApprenantDetailPlanningRow
            className={i !== items.length - 1 ? "fr-border-bottom" : ""}
            key={item.id}
            item={item}
            onPlanifier={handlePlanifier}
          />
        ))}
      </div>
    </div>
  );
}
