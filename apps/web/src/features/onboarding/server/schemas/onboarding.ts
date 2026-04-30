import { z } from "zod";

export const ONBOARDING_ROLES = ["DCS", "MDS", "CRF"] as const;
export type OnboardingRole = (typeof ONBOARDING_ROLES)[number];

export const ZOnboarding = z
  .object({
    role: z.enum(ONBOARDING_ROLES),
    juridictionId: z.string(),
    region: z.string(),
    nom: z.string(),
    prenom: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.role !== "CRF" && !data.juridictionId) {
      ctx.addIssue({
        path: ["juridictionId"],
        code: "custom",
        message: "Veuillez sélectionner une juridiction",
      });
    }
    if (data.role === "CRF" && !data.region) {
      ctx.addIssue({
        path: ["region"],
        code: "custom",
        message: "Veuillez sélectionner une région",
      });
    }
    if (!data.nom) {
      ctx.addIssue({ path: ["nom"], code: "custom", message: "Veuillez saisir votre nom" });
    }
    if (!data.prenom) {
      ctx.addIssue({
        path: ["prenom"],
        code: "custom",
        message: "Veuillez saisir votre prénom",
      });
    }
  });

export type TOnboarding = z.infer<typeof ZOnboarding>;
