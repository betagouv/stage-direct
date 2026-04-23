import { Button } from "@codegouvfr/react-dsfr/Button";
import { AuthLayout } from "../components/auth-layout";
import { ForgotPasswordForm } from "./forgot-password-form";

export function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <div className="fr-flex fr-direction-column fr-flex-gap-5v">
        <h1>Mot de passe oublié</h1>
        <p>
          Saisissez l'email de votre compte. Si un compte existe, un lien de réinitialisation vous
          sera envoyé.
        </p>
        <ForgotPasswordForm />
        <hr />
        <Button
          priority="secondary"
          iconId="fr-icon-arrow-left-line"
          iconPosition="left"
          linkProps={{ href: "/se-connecter" }}
        >
          Retour à la connexion
        </Button>
      </div>
    </AuthLayout>
  );
}
