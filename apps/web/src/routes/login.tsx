import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { authClient } from "~/lib/auth-client";

export const Route = createFileRoute("/login")({
  beforeLoad: ({ context: { session } }) => {
    if (session) {
      throw redirect({ to: "/" });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await authClient.signUp.email({
          email,
          password,
          name,
        });
        if (error) {
          setError(error.message ?? "Erreur lors de l'inscription.");
          return;
        }
      } else {
        const { error } = await authClient.signIn.email({
          email,
          password,
        });
        if (error) {
          setError(error.message ?? "Erreur lors de la connexion.");
          return;
        }
      }
      navigate({ to: "/" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fr-container fr-my-4w" style={{ maxWidth: 500 }}>
      <h1>{isSignUp ? "Creer un compte" : "Se connecter"}</h1>

      {error && <Alert severity="error" title="Erreur" description={error} className="fr-mb-3w" />}

      <form onSubmit={handleSubmit}>
        {isSignUp && (
          <Input
            label="Nom"
            nativeInputProps={{
              value: name,
              onChange: (e) => setName(e.target.value),
            }}
          />
        )}
        <Input
          label="Adresse email"
          nativeInputProps={{
            type: "email",
            value: email,
            onChange: (e) => setEmail(e.target.value),
            required: true,
          }}
        />
        <Input
          label="Mot de passe"
          nativeInputProps={{
            type: "password",
            value: password,
            onChange: (e) => setPassword(e.target.value),
            required: true,
            minLength: 8,
          }}
        />
        <Button type="submit" disabled={loading} className="fr-mt-2w">
          {loading ? "Chargement..." : isSignUp ? "S'inscrire" : "Se connecter"}
        </Button>
      </form>

      <button
        type="button"
        className="fr-link fr-mt-3w"
        onClick={() => {
          setIsSignUp(!isSignUp);
          setError(null);
        }}
      >
        {isSignUp ? "Deja un compte ? Se connecter" : "Pas de compte ? S'inscrire"}
      </button>
    </div>
  );
}
