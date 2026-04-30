import { createFileRoute } from "@tanstack/react-router";
import { redirectIfGuest } from "~/lib/route-guards";

export const Route = createFileRoute("/(authenticated)/_auth")({
  beforeLoad: redirectIfGuest,
});
