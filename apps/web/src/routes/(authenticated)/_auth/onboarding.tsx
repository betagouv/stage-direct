import { createFileRoute, redirect } from "@tanstack/react-router";
import { prefetchAuthentificationQueries } from "~/features/authentification/prefetch";
import { OnboardingPage } from "~/features/onboarding";

export const Route = createFileRoute("/(authenticated)/_auth/onboarding")({
  beforeLoad: ({ context: { session } }) => {
    if (session?.user.role) {
      throw redirect({ to: "/" });
    }
  },
  loader: ({ context: { queryClient, trpc } }) =>
    prefetchAuthentificationQueries(queryClient, trpc),
  component: RouteComponent,
});

function RouteComponent() {
  const { session } = Route.useRouteContext();
  return (
    <OnboardingPage userEmail={session?.user.email ?? ""} userName={session?.user.name ?? ""} />
  );
}
