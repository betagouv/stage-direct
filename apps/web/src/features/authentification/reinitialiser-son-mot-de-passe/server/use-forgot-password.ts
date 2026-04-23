import { useMutation } from "@tanstack/react-query";
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
  });
}
