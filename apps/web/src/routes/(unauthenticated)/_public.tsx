import { createFileRoute } from "@tanstack/react-router";
import { redirectIfAuthenticated } from "~/lib/route-guards";

export const Route = createFileRoute("/(unauthenticated)/_public")({
  beforeLoad: redirectIfAuthenticated,
});
