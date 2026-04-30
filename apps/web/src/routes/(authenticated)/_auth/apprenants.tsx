import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(authenticated)/_auth/apprenants")({
  component: () => (
    <div className="fr-container fr-my-4w">
      <h1>Apprenants</h1>
    </div>
  ),
});
