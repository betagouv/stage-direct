import { createFileRoute } from "@tanstack/react-router";
import { prefetchAuthentificationQueries } from "~/features/authentification/prefetch";
import { SignUpPage } from "~/features/authentification/s-inscrire";

export const Route = createFileRoute("/(unauthenticated)/_public/s-inscrire")({
  loader: ({ context: { queryClient, trpc } }) =>
    prefetchAuthentificationQueries(queryClient, trpc),
  component: SignUpPage,
});
