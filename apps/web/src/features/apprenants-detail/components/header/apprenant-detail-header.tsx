import { Button } from "@codegouvfr/react-dsfr/Button";
import Avatar from "@codegouvfr/react-dsfr/picto/Avatar";
import { formatPromotion } from "../../helpers";
import styles from "./apprenant-detail-header.module.css";

type Props = {
  apprenant: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string | null;
    promotion: { annee: number; nom: string | null };
  };
};

export function ApprenantDetailHeader({ apprenant }: Props) {
  return (
    <div
      className={`${styles.header} fr-flex fr-align-items-center fr-justify-content-space-between fr-flex-gap-6v`}
    >
      <div className="fr-flex fr-align-items-center fr-flex-gap-5v">
        <Avatar color="blue-ecume" width={80} height={80} />
        <div>
          <h1 className="fr-h2 fr-mb-1v">
            {apprenant.prenom} {apprenant.nom}
          </h1>
          <p className="fr-mb-0 fr-inline-flex fr-align-items-center fr-flex-gap-2v">
            <span className="fr-icon-team-line fr-icon--sm" aria-hidden="true" />
            {formatPromotion(apprenant.promotion)}
          </p>
        </div>
      </div>

      <div className="fr-flex fr-align-items-center fr-flex-gap-6v">
        <div className={`${styles.contact} fr-flex fr-direction-column fr-flex-gap-2v`}>
          <span className={styles.contactItem}>
            <span className="ri-mail-send-line fr-icon--sm" aria-hidden="true" />
            {apprenant.email}
          </span>
          {apprenant.telephone && (
            <span className={styles.contactItem}>
              <span className="fr-icon-phone-line fr-icon--sm" aria-hidden="true" />
              {apprenant.telephone}
            </span>
          )}
        </div>
        <Button
          iconId="fr-icon-edit-line"
          priority="tertiary"
          title="Modifier les informations"
          size="large"
        />
      </div>
    </div>
  );
}
