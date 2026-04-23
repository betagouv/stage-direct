import { z } from "zod";

export const SIGN_UP_ROLES = ["DCS", "MDS", "CRF"] as const;
export type SignUpRole = (typeof SIGN_UP_ROLES)[number];

export const ZSignUp = z
  .object({
    role: z.enum(SIGN_UP_ROLES),
    email: z
      .string()
      .min(1, "Veuillez saisir votre email")
      .email("Veuillez saisir un email valide"),
    nom: z.string().min(1, "Veuillez saisir votre nom"),
    prenom: z.string().min(1, "Veuillez saisir votre prénom"),
    password: z.string().min(12, "Votre mot de passe doit contenir au moins 12 caractères"),
    juridictionId: z.string(),
    region: z.string(),
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
  });

export type TSignUp = z.infer<typeof ZSignUp>;
