import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { authClient } from "~/lib/auth-client";
import type { TSignUp } from "./schemas/sign-up";
import { setUserRoleAndProfile } from "./set-user-role-and-profile.fn";

export function useSignUp() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (input: TSignUp) => {
      const { email, password, prenom, nom } = input;
      const name = `${prenom} ${nom}`.trim();

      const signUpResult = await authClient.signUp.email({ email, password, name });
      if (signUpResult.error) {
        throw new Error(signUpResult.error.message || "Erreur à l'inscription");
      }

      if (input.role === "DCS") {
        await setUserRoleAndProfile({
          data: { role: "DCS", juridictionId: input.juridictionId },
        });
      } else if (input.role === "MDS") {
        await setUserRoleAndProfile({
          data: {
            role: "MDS",
            juridictionId: input.juridictionId,
            nom,
            prenom,
          },
        });
      } else {
        await setUserRoleAndProfile({
          data: { role: "CRF", region: input.region },
        });
      }

      await router.invalidate();
      router.navigate({ to: "/" });
    },
  });
}
