import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(authenticated)/_auth/tableau-de-bord")({
  component: () => (
    <div className="fr-container fr-my-4w">
      <h1>Tableau de bord</h1>
    </div>
  ),
});
