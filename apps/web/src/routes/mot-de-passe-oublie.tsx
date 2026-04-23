import { createFileRoute } from "@tanstack/react-router";
import { ForgotPasswordPage } from "~/features/authentification/reinitialiser-son-mot-de-passe/forgot-password-page";
import { redirectIfAuthenticated } from "~/lib/route-guards";

export const Route = createFileRoute("/mot-de-passe-oublie")({
  beforeLoad: redirectIfAuthenticated,
  component: ForgotPasswordPage,
});
