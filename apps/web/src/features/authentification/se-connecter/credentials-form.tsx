import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { useForm } from "@tanstack/react-form";
import { PasswordInput } from "../components/password-input";
import { ZSignIn } from "./server/schemas/sign-in";
import { useSignIn } from "./server/use-sign-in";

export function CredentialsForm() {
  const signIn = useSignIn();

  const form = useForm({
    defaultValues: { email: "", password: "" },
    onSubmit: async ({ value }) => {
      const parsed = ZSignIn.safeParse(value);
      if (!parsed.success) {
        throw new Error(parsed.error.issues.map((i) => i.message).join(", "));
      }
      await signIn.mutateAsync(parsed.data);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
    >
      <form.Field name="email">
        {(field) => (
          <Input
            label="E-mail"
            state={field.state.meta.errors.length ? "error" : undefined}
            stateRelatedMessage={String(field.state.meta.errors[0] ?? "")}
            nativeInputProps={{
              type: "email",
              name: field.name,
              value: field.state.value,
              onBlur: field.handleBlur,
              onChange: (e) => field.handleChange(e.target.value),
            }}
          />
        )}
      </form.Field>

      <form.Field name="password">
        {(field) => (
          <PasswordInput
            label="Mot de passe"
            state={field.state.meta.errors.length ? "error" : undefined}
            stateRelatedMessage={String(field.state.meta.errors[0] ?? "")}
            nativeInputProps={{
              name: field.name,
              value: field.state.value,
              onBlur: field.handleBlur,
              onChange: (e) => field.handleChange(e.target.value),
            }}
          />
        )}
      </form.Field>

      <a href="/mot-de-passe-oublie" className="fr-link">
        Mot de passe oublié ?
      </a>

      {signIn.isError && (
        <Alert
          severity="error"
          small
          description={signIn.error instanceof Error ? signIn.error.message : "Erreur"}
        />
      )}

      <Button type="submit" disabled={signIn.isPending} iconId="fr-icon-arrow-right-line" iconPosition="right">
        {signIn.isPending ? "Connexion..." : "Se connecter"}
      </Button>
    </form>
  );
}
