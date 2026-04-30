import type { FonctionStage, StatutStage, TypeApprenant } from "~/generated/prisma/enums";

export const FONCTIONS_ORDRE: FonctionStage[] = [
  "PARQUET",
  "INSTRUCTION",
  "JAF",
  "JAP",
  "JCP",
  "JE",
  "PENAL",
  "CIVIL",
];

export const FONCTION_LABEL: Record<FonctionStage, string> = {
  PARQUET: "Parquet",
  INSTRUCTION: "Instruction",
  JAF: "JAF",
  JAP: "JAP",
  JCP: "JCP",
  JE: "JE",
  PENAL: "Pénal",
  CIVIL: "Civil",
};

export type FonctionEtat = "VALIDE" | "EN_COURS" | "A_FAIRE";

export function getFonctionEtat(
  stages: { fonction: FonctionStage; statut: StatutStage }[],
  fonction: FonctionStage,
): FonctionEtat {
  const stage = stages.find((s) => s.fonction === fonction);
  if (!stage) return "A_FAIRE";
  if (stage.statut === "TERMINE" || stage.statut === "CLOTURE") return "VALIDE";
  if (stage.statut === "EN_COURS") return "EN_COURS";
  return "A_FAIRE";
}

export function getInitials(prenom: string, nom: string) {
  const a = prenom?.trim()[0] ?? "";
  const b = nom?.trim()[0] ?? "";
  return `${a}${b}`.toUpperCase();
}

export function formatTypeApprenant(type: TypeApprenant): string {
  return type === "ADJ" ? "Auditeur de justice" : "Stagiaire du concours professionnel";
}

export function formatStatutGlobal(statut: "EN_COURS" | "EN_ATTENTE" | "TERMINE"): string {
  if (statut === "EN_COURS") return "Stage en cours";
  if (statut === "EN_ATTENTE") return "En attente";
  return "Terminé";
}

export function formatPerimetreLabel(
  perimetre:
    | { type: "DCS"; juridiction: { nom: string } }
    | { type: "CRF"; region: string }
    | { type: "ENM" },
): string {
  if (perimetre.type === "DCS") return `Auditeurs de justice du ${perimetre.juridiction.nom}`;
  if (perimetre.type === "CRF") return `Auditeurs de justice de la région ${perimetre.region}`;
  return "Auditeurs de justice (toutes juridictions)";
}
