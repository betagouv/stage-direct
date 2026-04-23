import { z } from "zod";

export const ZResetPassword = z
  .object({
    password: z
      .string()
      .min(12, "Votre mot de passe doit contenir au moins 12 caractères"),
    confirmPassword: z.string().min(1, "Veuillez confirmer votre mot de passe"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Les mots de passe ne correspondent pas",
  });

export type TResetPassword = z.infer<typeof ZResetPassword>;
