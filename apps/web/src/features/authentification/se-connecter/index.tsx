import { Button } from "@codegouvfr/react-dsfr/Button";
import { AuthLayout } from "../components/auth-layout";
import { ProConnectButton } from "../components/proconnect-button";
import { CredentialsForm } from "./credentials-form";

export function SignInPage() {
  return (
    <AuthLayout>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div>
          <h1 style={{ marginBottom: "0.5rem" }}>Connectez-vous à StageDirect</h1>
          <p style={{ color: "var(--text-mention-grey)" }}>
            ProConnect est la solution proposée par l'État pour sécuriser et
            simplifier la connexion à vos services en ligne.
          </p>
        </div>

        <ProConnectButton />

        <div
          style={{
            position: "relative",
            textAlign: "center",
            margin: "1.5rem 0",
          }}
        >
          <span
            style={{
              background: "var(--background-default-grey)",
              padding: "0 1rem",
              color: "var(--text-mention-grey)",
              position: "relative",
              zIndex: 1,
              fontWeight: 700,
            }}
          >
            OU
          </span>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              right: 0,
              height: 1,
              background: "var(--border-default-grey)",
              zIndex: 0,
            }}
          />
        </div>

        <div>
          <h2 style={{ marginBottom: "0.5rem" }}>Connectez-vous manuellement</h2>
          <p className="fr-text--sm" style={{ color: "var(--text-mention-grey)" }}>
            Les champs marqués du symbole <span style={{ color: "red" }}>*</span> sont obligatoires.
          </p>
        </div>

        <CredentialsForm />

        <div
          style={{
            background: "var(--background-alt-grey)",
            padding: "2rem",
            marginTop: "1.5rem",
            marginLeft: "-3rem",
            marginRight: "-3rem",
            marginBottom: "-4rem",
          }}
        >
          <h2 style={{ marginBottom: "0.5rem" }}>Vous n'avez pas encore de compte ?</h2>
          <p className="fr-text--sm" style={{ color: "var(--text-mention-grey)", marginBottom: "1rem" }}>
            Créez votre compte dès maintenant pour suivre vos démarches
          </p>
          <Button priority="secondary" iconId="fr-icon-account-circle-line" linkProps={{ href: "/s-inscrire" }}>
            Créer un compte
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
}
