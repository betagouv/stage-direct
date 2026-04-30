import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(authenticated)/_auth/centre-d-aide")({
  component: () => (
    <div className="fr-container fr-my-4w">
      <h1>Centre d'aide</h1>
    </div>
  ),
});
