import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { createToast } from "~/components/ui/create-toast";
import { authClient } from "~/lib/auth-client";
import { getSessionQueryOptions } from "~/lib/session-query";
import type { TSignIn } from "./schemas/sign-in";

export function useSignIn() {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: TSignIn) => {
      const result = await authClient.signIn.email({
        email: input.email,
        password: input.password,
      });
      if (result.error) {
        throw new Error(result.error.message || "Email ou mot de passe incorrect.");
      }
    },
    onSuccess: async () => {
      createToast({ priority: "success", message: "Vous êtes connecté." });
      await queryClient.invalidateQueries({ queryKey: getSessionQueryOptions().queryKey });
      await router.invalidate();
      router.navigate({ to: "/" });
    },
    onError: (error) => {
      createToast({
        priority: "error",
        message: error instanceof Error ? error.message : "Erreur à la connexion",
      });
    },
  });
}
