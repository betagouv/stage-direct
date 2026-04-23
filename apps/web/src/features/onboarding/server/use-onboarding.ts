import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { createToast } from "~/components/ui/create-toast";
import { useTRPC } from "~/utils/trpc";
import type { TOnboarding } from "./schemas/onboarding";

export function useOnboarding() {
  const router = useRouter();
  const trpc = useTRPC();
  const setProfile = useMutation(trpc.authentification.setUserRoleAndProfile.mutationOptions());

  return useMutation({
    mutationFn: async (input: TOnboarding) => {
      await setProfile.mutateAsync(input);
    },
    onSuccess: async () => {
      createToast({ priority: "success", message: "Profil finalisé." });
      await router.invalidate();
      router.navigate({ to: "/" });
    },
    onError: (error) => {
      createToast({
        priority: "error",
        message: error instanceof Error ? error.message : "Erreur",
      });
    },
  });
}
