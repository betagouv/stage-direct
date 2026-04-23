import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { AuthLayout } from "../components/auth-layout";
import { ResetPasswordForm } from "./reset-password-form";

type ResetPasswordPageProps = {
  token: string | undefined;
};

export function ResetPasswordPage({ token }: ResetPasswordPageProps) {
  return (
    <AuthLayout>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <h1>Réinitialiser votre mot de passe</h1>
        {token ? (
          <ResetPasswordForm token={token} />
        ) : (
          <Alert
            severity="error"
            small
            description="Lien invalide ou expiré. Demandez un nouveau lien de réinitialisation."
          />
        )}
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
