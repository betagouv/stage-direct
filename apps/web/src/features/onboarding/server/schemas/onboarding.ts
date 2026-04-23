import { z } from "zod";

export const ZOnboarding = z.discriminatedUnion("role", [
  z.object({
    role: z.literal("DCS"),
    juridictionId: z.string().min(1, "Veuillez sélectionner une juridiction"),
  }),
  z.object({
    role: z.literal("MDS"),
    juridictionId: z.string().min(1, "Veuillez sélectionner une juridiction"),
    nom: z.string().min(1, "Veuillez saisir votre nom"),
    prenom: z.string().min(1, "Veuillez saisir votre prénom"),
  }),
  z.object({
    role: z.literal("CRF"),
    region: z.string().min(1, "Veuillez sélectionner une région"),
  }),
]);

export type TOnboarding = z.infer<typeof ZOnboarding>;
export type OnboardingRole = TOnboarding["role"];
