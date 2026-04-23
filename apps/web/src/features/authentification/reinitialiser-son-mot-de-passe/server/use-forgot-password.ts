import { useMutation } from "@tanstack/react-query";
import { createToast } from "~/components/ui/create-toast";
import { authClient } from "~/lib/auth-client";
import type { TForgotPassword } from "./schemas/forgot-password";

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (input: TForgotPassword) => {
      const result = await authClient.requestPasswordReset({
        email: input.email,
        redirectTo: "/reinitialiser-son-mot-de-passe",
      });
      if (result.error) {
        throw new Error(result.error.message || "Une erreur est survenue.");
      }
    },
    onSuccess: () => {
      createToast({
        priority: "success",
        message:
          "Si un compte existe pour cet email, un lien de réinitialisation vient d'être envoyé.",
      });
    },
    onError: (error) => {
      createToast({
        priority: "error",
        message: error instanceof Error ? error.message : "Une erreur est survenue",
      });
    },
  });
}
