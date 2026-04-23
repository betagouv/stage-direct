import { createFileRoute } from "@tanstack/react-router";
import { prefetchAuthentificationQueries } from "~/features/authentification/prefetch";
import { SignUpPage } from "~/features/authentification/s-inscrire";
import { redirectIfAuthenticated } from "~/lib/route-guards";

export const Route = createFileRoute("/s-inscrire")({
  beforeLoad: redirectIfAuthenticated,
  loader: ({ context: { queryClient, trpc } }) =>
    prefetchAuthentificationQueries(queryClient, trpc),
  component: SignUpPage,
});
