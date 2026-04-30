import { createFileRoute } from "@tanstack/react-router";
import { ForgotPasswordPage } from "~/features/authentification/reinitialiser-son-mot-de-passe/forgot-password-page";

export const Route = createFileRoute("/(unauthenticated)/_public/mot-de-passe-oublie")({
  component: ForgotPasswordPage,
});
