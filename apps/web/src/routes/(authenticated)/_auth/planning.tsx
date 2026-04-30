import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(authenticated)/_auth/planning")({
  component: () => (
    <div className="fr-container fr-my-4w">
      <h1>Planning</h1>
    </div>
  ),
});
