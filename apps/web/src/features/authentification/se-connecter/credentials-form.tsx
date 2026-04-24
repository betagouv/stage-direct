import { Button } from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { useForm } from "@tanstack/react-form";
import { getFieldErrorProps } from "~/utils/form-errors";
import { PasswordInput } from "../components/password-input";
import { ZSignIn } from "./server/schemas/sign-in";
import { useSignIn } from "./server/use-sign-in";

export function CredentialsForm() {
  const signIn = useSignIn();

  const form = useForm({
    defaultValues: { email: "", password: "" },
    validators: { onChange: ZSignIn },
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
      className="fr-flex fr-direction-column fr-flex-gap-8v fr-mb-4w"
    >
      <form.Field name="email">
        {(field) => (
          <Input
            classes={{ root: "fr-mb-0" }}
            label={
              <>
                E-mail <span className="fr-text-default--error">*</span>
              </>
            }
            {...getFieldErrorProps(field.state.meta)}
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
            classes={{ root: "fr-mb-0" }}
            label={
              <>
                Mot de passe <span className="fr-text-default--error">*</span>
              </>
            }
            {...getFieldErrorProps(field.state.meta)}
            nativeInputProps={{
              name: field.name,
              value: field.state.value,
              onBlur: field.handleBlur,
              onChange: (e) => field.handleChange(e.target.value),
            }}
          />
        )}
      </form.Field>

      <div>
        <a href="/mot-de-passe-oublie" className="fr-link">
          Mot de passe oublié ?
        </a>
      </div>

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
