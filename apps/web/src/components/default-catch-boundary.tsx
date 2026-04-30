import { Button } from "@codegouvfr/react-dsfr/Button";
import { type ErrorComponentProps, useRouter } from "@tanstack/react-router";

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="fr-container fr-py-8w">
      <h1>Une erreur est survenue</h1>
      <div className="fr-alert fr-alert--error fr-my-4w">
        <p>{error.message || "Erreur inconnue"}</p>
      </div>
      <div className="fr-flex fr-flex-gap-2w">
        <Button onClick={() => router.invalidate()}>Réessayer</Button>
        <Button priority="secondary" linkProps={{ href: "/" }}>
          Retour à l'accueil
        </Button>
      </div>
    </div>
  );
}
