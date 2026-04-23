import { Button } from "@codegouvfr/react-dsfr/Button";
import { AuthLayout } from "../components/auth-layout";
import { ProConnectButton } from "../components/proconnect-button";
import { CredentialsForm } from "./credentials-form";
import styles from "./sign-in-page.module.css";

export function SignInPage() {
  return (
    <AuthLayout>
      <div className="fr-flex fr-direction-column fr-flex-gap-5v">
        <div>
          <h1 className="fr-mb-1w">Connectez-vous à StageDirect</h1>
          <p className="fr-text-mention--grey">
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
          <h2 className="fr-mb-1w">Connectez-vous manuellement</h2>
          <p className="fr-text--sm fr-text-mention--grey">
            Les champs marqués du symbole <span className="fr-text-default--error">*</span> sont
            obligatoires.
          </p>
        </div>

        <CredentialsForm />

        <div className={styles.signupCallout}>
          <h2 className="fr-mb-1w">Vous n'avez pas encore de compte ?</h2>
          <p className="fr-text--sm fr-text-mention--grey fr-mb-2w">
            Créez votre compte dès maintenant pour suivre vos démarches
          </p>
          <Button
            priority="secondary"
            iconId="fr-icon-account-circle-line"
            linkProps={{ href: "/s-inscrire" }}
          >
            Créer un compte
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
}
