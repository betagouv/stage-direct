import { Button } from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { useForm } from "@tanstack/react-form";
import { ZForgotPassword } from "./server/schemas/forgot-password";
import { useForgotPassword } from "./server/use-forgot-password";

export function ForgotPasswordForm() {
  const forgotPassword = useForgotPassword();

  const form = useForm({
    defaultValues: { email: "" },
    validators: { onSubmit: ZForgotPassword },
    onSubmit: async ({ value }) => {
      await forgotPassword.mutateAsync(value);
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

      <Button
        type="submit"
        disabled={forgotPassword.isPending}
        iconId="fr-icon-arrow-right-line"
        iconPosition="right"
      >
        {forgotPassword.isPending ? "Envoi..." : "Envoyer le lien de réinitialisation"}
      </Button>
    </form>
  );
}
