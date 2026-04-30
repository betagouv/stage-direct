import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(authenticated)/_auth/ressources-enm")({
  component: () => (
    <div className="fr-container fr-my-4w">
      <h1>Ressources ENM</h1>
    </div>
  ),
});
