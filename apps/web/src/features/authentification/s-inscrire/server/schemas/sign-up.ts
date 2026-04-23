import { z } from "zod";

const base = z.object({
  email: z
    .string()
    .min(1, "Veuillez saisir votre email")
    .email("Veuillez saisir un email valide"),
  nom: z.string().min(1, "Veuillez saisir votre nom"),
  prenom: z.string().min(1, "Veuillez saisir votre prénom"),
  password: z
    .string()
    .min(12, "Votre mot de passe doit contenir au moins 12 caractères"),
});

export const ZSignUp = z.discriminatedUnion("role", [
  base.extend({
    role: z.literal("DCS"),
    juridictionId: z.string().min(1, "Veuillez sélectionner une juridiction"),
  }),
  base.extend({
    role: z.literal("MDS"),
    juridictionId: z.string().min(1, "Veuillez sélectionner une juridiction"),
  }),
  base.extend({
    role: z.literal("CRF"),
    region: z.string().min(1, "Veuillez sélectionner une région"),
  }),
]);

export type TSignUp = z.infer<typeof ZSignUp>;
export type SignUpRole = TSignUp["role"];
