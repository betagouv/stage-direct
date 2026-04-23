import { createFileRoute } from "@tanstack/react-router";
import { SignInPage } from "~/features/authentification/se-connecter";
import { redirectIfAuthenticated } from "~/lib/route-guards";

export const Route = createFileRoute("/se-connecter")({
  beforeLoad: redirectIfAuthenticated,
  component: SignInPage,
});
