import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ResetPasswordPage } from "~/features/authentification/reinitialiser-son-mot-de-passe";

const ResetPasswordSearch = z.object({
  token: z.string().optional(),
});

export const Route = createFileRoute("/reinitialiser-son-mot-de-passe")({
  validateSearch: ResetPasswordSearch,
  component: RouteComponent,
});

function RouteComponent() {
  const { token } = Route.useSearch();
  return <ResetPasswordPage token={token} />;
}
