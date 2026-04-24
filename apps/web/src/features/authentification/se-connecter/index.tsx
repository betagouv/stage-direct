import { Button } from "@codegouvfr/react-dsfr/Button";
import classNames from "classnames";
import { AuthLayout } from "../components/auth-layout";
import { ProConnectButton } from "../components/proconnect-button";
import { CredentialsForm } from "./credentials-form";
import styles from "./sign-in-page.module.css";

export function SignInPage() {
  return (
    <AuthLayout>
      <div className="fr-flex fr-direction-column fr-flex-gap-5v">
        <div>
          <h1 className={classNames(styles.title, "fr-mb-1w")}>Connectez-vous à StageDirect</h1>
          <p className="fr-text-mention--grey fr-mb-0">
            ProConnect est la solution proposée par l'État pour sécuriser et simplifier la connexion
            à vos services en ligne.
          </p>
        </div>

        <ProConnectButton />

        <div className={styles.dividerWrap}>
          <span className={styles.dividerLabel}>OU</span>
          <div className={styles.dividerLine} />
        </div>

        <div>
          <h2 className={classNames(styles.title, "fr-mb-1w")}>Connectez-vous manuellement</h2>
          <p className="fr-text--sm fr-text-mention--grey fr-mb-0">
            Les champs marqués du symbole <span className="fr-text-default--error">*</span> sont
            obligatoires.
          </p>
        </div>

        <CredentialsForm />

        <div
          className={classNames(
            styles.signupCallout,
            "fr-flex fr-direction-column fr-justify-content-center",
          )}
        >
          <h2 className="fr-h3 fr-mb-2w">Vous n'avez pas encore de compte ?</h2>
          <p className="fr-text-mention--grey">
            Créez votre compte dès maintenant pour suivre vos démarches
          </p>
          <Button
            priority="secondary"
            iconId="fr-icon-account-circle-line"
            linkProps={{ href: "/s-inscrire" }}
            size="large"
          >
            Créer un compte
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
}
