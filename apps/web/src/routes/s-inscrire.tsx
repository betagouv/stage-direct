import { createFileRoute } from "@tanstack/react-router";
import { SignUpPage } from "~/features/authentification/s-inscrire";
import { redirectIfAuthenticated } from "~/lib/route-guards";

export const Route = createFileRoute("/s-inscrire")({
  beforeLoad: redirectIfAuthenticated,
  component: SignUpPage,
});
