import { createFileRoute, redirect } from "@tanstack/react-router";
import { ForgotPasswordPage } from "~/features/authentification/reinitialiser-son-mot-de-passe/forgot-password-page";

export const Route = createFileRoute("/mot-de-passe-oublie")({
  beforeLoad: ({ context: { session } }) => {
    if (session) {
      throw redirect({ to: "/" });
    }
  },
  component: ForgotPasswordPage,
});
