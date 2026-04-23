import { z } from "zod";

export const ZForgotPassword = z.object({
  email: z.string().min(1, "Veuillez saisir votre email").email("Veuillez saisir un email valide"),
});

export type TForgotPassword = z.infer<typeof ZForgotPassword>;
