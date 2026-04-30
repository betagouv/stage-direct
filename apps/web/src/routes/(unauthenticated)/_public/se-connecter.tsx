import { createFileRoute } from "@tanstack/react-router";
import { SignInPage } from "~/features/authentification/se-connecter";

export const Route = createFileRoute("/(unauthenticated)/_public/se-connecter")({
  component: SignInPage,
});
