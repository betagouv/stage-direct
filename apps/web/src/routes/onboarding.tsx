import { createFileRoute } from "@tanstack/react-router";
import { OnboardingPage } from "~/features/onboarding";
import { redirectIfProfileComplete } from "~/lib/route-guards";

export const Route = createFileRoute("/onboarding")({
  beforeLoad: redirectIfProfileComplete,
  component: RouteComponent,
});

function RouteComponent() {
  const { session } = Route.useRouteContext();
  return (
    <OnboardingPage userEmail={session?.user.email ?? ""} userName={session?.user.name ?? ""} />
  );
}
