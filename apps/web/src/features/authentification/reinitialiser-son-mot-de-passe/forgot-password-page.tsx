import { Button } from "@codegouvfr/react-dsfr/Button";
import { AuthLayout } from "../components/auth-layout";
import { ForgotPasswordForm } from "./forgot-password-form";

export function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <div className="fr-flex fr-direction-column fr-flex-gap-8v">
        <h1 className="fr-h3 fr-mb-0">Réinitialiser son mot de passe</h1>
        <div>
          <p className="fr-mb-0">
            Saisissez l'email de votre compte. Si un compte existe, un lien de réinitialisation vous
            sera envoyé.
          </p>
          <p className="fr-mb-0">Tous les champs du formulaire sont obligatoires.</p>
        </div>
        <ForgotPasswordForm />
        <hr className="fr-py-0" style={{ height: 1 }} />
        <Button
          priority="secondary"
          iconId="fr-icon-arrow-left-line"
          size="large"
          iconPosition="left"
          linkProps={{ href: "/se-connecter" }}
        >
          Retour à la connexion
        </Button>
      </div>
    </AuthLayout>
  );
}
