import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { useForm } from "@tanstack/react-form";
import { PasswordInput } from "../components/password-input";
import { ZResetPassword } from "./server/schemas/reset-password";
import { useResetPassword } from "./server/use-reset-password";

type ResetPasswordFormProps = {
  token: string;
};

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const resetPassword = useResetPassword();

  const form = useForm({
    defaultValues: { password: "", confirmPassword: "" },
    onSubmit: async ({ value }) => {
      const parsed = ZResetPassword.safeParse(value);
      if (!parsed.success) {
        throw new Error(parsed.error.issues.map((i) => i.message).join(", "));
      }
      await resetPassword.mutateAsync({ token, password: parsed.data.password });
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
      <form.Field name="password">
        {(field) => (
          <PasswordInput
            label="Nouveau mot de passe"
            hintText="12 caractères minimum"
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

      <form.Field name="confirmPassword">
        {(field) => (
          <PasswordInput
            label="Confirmer le mot de passe"
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

      <Button type="submit" disabled={resetPassword.isPending || !token} iconId="fr-icon-arrow-right-line" iconPosition="right">
        {resetPassword.isPending ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
      </Button>

      {resetPassword.isSuccess && (
        <Alert
          severity="success"
          small
          description="Mot de passe réinitialisé. Redirection vers la connexion..."
        />
      )}
      {resetPassword.isError && (
        <Alert
          severity="error"
          small
          description={resetPassword.error instanceof Error ? resetPassword.error.message : "Erreur"}
        />
      )}
    </form>
  );
}
