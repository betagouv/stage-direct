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
    validators: { onSubmit: ZSignIn },
    onSubmit: async ({ value }) => {
      await signIn.mutateAsync(value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="fr-flex fr-direction-column fr-flex-gap-4v"
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

      <Button
        type="submit"
        disabled={signIn.isPending}
        iconId="fr-icon-arrow-right-line"
        iconPosition="right"
      >
        {signIn.isPending ? "Connexion..." : "Se connecter"}
      </Button>
    </form>
  );
}
