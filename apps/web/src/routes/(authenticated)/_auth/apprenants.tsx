import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { ApprenantsPage } from "~/features/apprenants";

const GESTIONNAIRE_ROLES = ["DCS", "CRF", "ENM"] as const;

const searchSchema = z.object({
  type: z.enum(["ALL", "ADJ", "CONCOURS_PRO"]).default("ALL").catch("ALL"),
  statut: z.enum(["ALL", "EN_COURS", "EN_ATTENTE", "TERMINE"]).default("ALL").catch("ALL"),
  sort: z.enum(["nom_asc", "nom_desc"]).default("nom_asc").catch("nom_asc"),
  page: z.number().int().min(1).default(1).catch(1),
});

export const Route = createFileRoute("/(authenticated)/_auth/apprenants")({
  validateSearch: searchSchema,
  beforeLoad: ({ context: { session } }) => {
    const role = session?.user?.role;
    if (!role || !GESTIONNAIRE_ROLES.includes(role as (typeof GESTIONNAIRE_ROLES)[number])) {
      throw redirect({ to: "/tableau-de-bord" });
    }
  },
  component: ApprenantsPage,
});
