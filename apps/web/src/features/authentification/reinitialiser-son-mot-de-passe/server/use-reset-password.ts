import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { createToast } from "~/components/ui/create-toast";
import { authClient } from "~/lib/auth-client";

export function useResetPassword() {
  const router = useRouter();
  return useMutation({
    mutationFn: async (input: { token: string; password: string }) => {
      const result = await authClient.resetPassword({
        token: input.token,
        newPassword: input.password,
      });
      if (result.error) {
        throw new Error(result.error.message || "Impossible de réinitialiser.");
      }
    },
    onSuccess: () => {
      createToast({
        priority: "success",
        message: "Votre mot de passe a été réinitialisé. Connectez-vous.",
      });
      router.navigate({ to: "/se-connecter" });
    },
    onError: (error) => {
      createToast({
        priority: "error",
        message: error instanceof Error ? error.message : "Erreur",
      });
    },
  });
}
