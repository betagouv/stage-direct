import { z } from "zod";

export const ZSignIn = z.object({
  email: z
    .string()
    .min(1, "Veuillez saisir votre email")
    .email("Veuillez saisir un email valide"),
  password: z.string().min(1, "Veuillez saisir votre mot de passe"),
});

export type TSignIn = z.infer<typeof ZSignIn>;
