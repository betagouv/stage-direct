import type { StatutStage } from "~/generated/prisma/enums";

type StageForStats = { statut: StatutStage; mds: unknown | null };

export function computeStagesStats(stages: StageForStats[]) {
  return {
    termines: stages.filter((s) => s.statut === "TERMINE" || s.statut === "CLOTURE").length,
    enCours: stages.filter((s) => s.statut === "EN_COURS").length,
    planifies: stages.filter((s) => s.statut === "PLANIFIE" && s.mds !== null).length,
    aPlanifier: stages.filter(
      (s) => s.mds === null && s.statut !== "TERMINE" && s.statut !== "CLOTURE",
    ).length,
  };
}

export function formatPromotion(promotion: { annee: number; nom: string | null }) {
  return promotion.nom ?? `Promo ${promotion.annee}`;
}
