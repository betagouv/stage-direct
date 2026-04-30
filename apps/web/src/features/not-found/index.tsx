import { Button } from "@codegouvfr/react-dsfr/Button";

export function NotFoundPage() {
  return (
    <div className="fr-container fr-pb-12w fr-pt-4w">
      <h1>Page introuvable</h1>
      <hr />
      <div
        className="fr-grid-row fr-grid-row--gutters fr-grid-row--middle"
        style={{ justifyContent: "space-between" }}
      >
        <div className="fr-col-12 fr-col-md-7">
          <h3>Erreur 404</h3>
          <p>La page que vous cherchez est introuvable. Excusez-nous pour la gêne occasionnée.</p>
          <p className="fr-m-0">
            Si vous avez tapé l'adresse web dans le navigateur, vérifiez qu'elle est correcte.
          </p>
          <p className="fr-m-0">La page n'est peut-être plus disponible.</p>
          <p>
            Dans ce cas, pour continuer votre visite vous pouvez consulter la page d'accueil.
          </p>
          <Button iconId="ri-arrow-left-line" iconPosition="left" linkProps={{ href: "/" }}>
            Page d'accueil
          </Button>
        </div>
        <div className="fr-col-12 fr-col-md-4 fr-text--center">
          <img src="/images/404.svg" alt="" width={282} height={319} />
        </div>
      </div>
    </div>
  );
}
