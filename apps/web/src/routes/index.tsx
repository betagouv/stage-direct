import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useTRPC } from "~/utils/trpc";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context: { session } }) => {
    if (!session) {
      throw redirect({ to: "/se-connecter" });
    }
  },
  loader: ({ context: { queryClient, trpc } }) =>
    queryClient.ensureQueryData(trpc.user.list.queryOptions()),
  component: HomePage,
});

function HomePage() {
  const { session } = Route.useRouteContext();
  const trpc = useTRPC();
  const usersQuery = useQuery(trpc.user.list.queryOptions());

  return (
    <div className="fr-container fr-my-4w">
      <h1>Bienvenue, {session?.user.name || session?.user.email}</h1>

      <div className="fr-card fr-card--no-border fr-p-3w">
        <h2>Utilisateurs</h2>
        {usersQuery.isLoading && <p>Chargement...</p>}
        {usersQuery.isError && (
          <div className="fr-alert fr-alert--error fr-my-2w">
            <p>Erreur lors du chargement des utilisateurs.</p>
          </div>
        )}
        {usersQuery.data?.length === 0 && (
          <p className="fr-text--sm">Aucun utilisateur pour le moment.</p>
        )}
        {usersQuery.data && usersQuery.data.length > 0 && (
          <ul className="fr-raw-list">
            {usersQuery.data.map((u) => (
              <li key={u.id} className="fr-py-1w">
                <strong>{u.name || "Sans nom"}</strong> — {u.email}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
