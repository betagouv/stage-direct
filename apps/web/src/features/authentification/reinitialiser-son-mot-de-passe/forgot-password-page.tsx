import { Button } from "@codegouvfr/react-dsfr/Button";
import { AuthLayout } from "../components/auth-layout";
import { ForgotPasswordForm } from "./forgot-password-form";

export function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <h1>Mot de passe oublié</h1>
        <p>
          Saisissez l'email de votre compte. Si un compte existe, un lien de
          réinitialisation vous sera envoyé.
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
