import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { authClient } from "~/lib/auth-client";
import type { TSignIn } from "./schemas/sign-in";

export function useSignIn() {
  const router = useRouter();
  return useMutation({
    mutationFn: async (input: TSignIn) => {
      const result = await authClient.signIn.email({
        email: input.email,
        password: input.password,
      });
      if (result.error) {
        throw new Error(result.error.message || "Email ou mot de passe incorrect.");
      }
      await router.invalidate();
      router.navigate({ to: "/" });
    },
  });
}
