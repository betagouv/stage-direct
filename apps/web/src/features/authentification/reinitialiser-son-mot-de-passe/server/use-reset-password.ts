import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
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
      setTimeout(() => router.navigate({ to: "/se-connecter" }), 1500);
    },
  });
}
