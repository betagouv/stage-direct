import { createFileRoute } from "@tanstack/react-router";
import { ApprenantDetailPage } from "~/features/apprenants-detail";

export const Route = createFileRoute("/(authenticated)/_auth/apprenants_/$id")({
  loader: async ({ context: { queryClient, trpc }, params: { id } }) => {
    await queryClient.ensureQueryData(trpc.auditeur.byId.queryOptions({ id }));
  },
  component: ApprenantDetailPage,
});
