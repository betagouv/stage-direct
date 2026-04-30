import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { createToast } from "~/components/ui/create-toast";
import { authClient } from "~/lib/auth-client";
import { useTRPC } from "~/utils/trpc";
import type { TSignUp } from "./schemas/sign-up";

export function useSignUp() {
  const router = useRouter();
  const trpc = useTRPC();
  const setProfile = useMutation(trpc.authentification.setUserRoleAndProfile.mutationOptions());

  return useMutation({
    mutationFn: async (input: TSignUp) => {
      const { email, password, prenom, nom } = input;
      const name = `${prenom} ${nom}`.trim();

      const signUpResult = await authClient.signUp.email({ email, password, name, nom, prenom });
      if (signUpResult.error) {
        throw new Error(signUpResult.error.message || "Erreur à l'inscription");
      }

      if (input.role === "DCS") {
        await setProfile.mutateAsync({
          role: "DCS",
          juridictionId: input.juridictionId,
          nom,
          prenom,
        });
      } else if (input.role === "MDS") {
        await setProfile.mutateAsync({
          role: "MDS",
          juridictionId: input.juridictionId,
          nom,
          prenom,
        });
      } else {
        await setProfile.mutateAsync({ role: "CRF", region: input.region, nom, prenom });
      }
    },
    onSuccess: async () => {
      createToast({ priority: "success", message: "Votre compte a été créé." });
      await router.invalidate();
      router.navigate({ to: "/" });
    },
    onError: (error) => {
      createToast({
        priority: "error",
        message: error instanceof Error ? error.message : "Erreur à l'inscription",
      });
    },
  });
}
