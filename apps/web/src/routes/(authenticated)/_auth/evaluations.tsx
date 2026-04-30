import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(authenticated)/_auth/evaluations")({
  component: () => (
    <div className="fr-container fr-my-4w">
      <h1>Evaluations</h1>
    </div>
  ),
});
