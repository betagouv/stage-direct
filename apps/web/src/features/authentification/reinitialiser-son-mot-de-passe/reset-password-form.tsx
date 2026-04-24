import { Button } from "@codegouvfr/react-dsfr/Button";
import { useForm } from "@tanstack/react-form";
import { getFieldErrorProps } from "~/utils/form-errors";
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
    validators: { onChange: ZResetPassword },
    onSubmit: async ({ value }) => {
      await resetPassword.mutateAsync({ token, password: value.password });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="fr-flex fr-direction-column fr-flex-gap-8v"
    >
      <form.Field name="password">
        {(field) => (
          <PasswordInput
            label="Nouveau mot de passe"
            hintText="12 caractères minimum"
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

      <form.Field name="confirmPassword">
        {(field) => (
          <PasswordInput
            label="Confirmer le mot de passe"
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

      <Button
        type="submit"
        disabled={resetPassword.isPending || !token}
        iconId="fr-icon-arrow-right-line"
        iconPosition="right"
      >
        {resetPassword.isPending ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
      </Button>
    </form>
  );
}
