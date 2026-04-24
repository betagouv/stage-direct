import { Button } from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { useForm } from "@tanstack/react-form";
import { getFieldErrorMessage } from "~/utils/form-errors";
import { ZForgotPassword } from "./server/schemas/forgot-password";
import { useForgotPassword } from "./server/use-forgot-password";

export function ForgotPasswordForm() {
  const forgotPassword = useForgotPassword();

  const form = useForm({
    defaultValues: { email: "" },
    validators: { onChange: ZForgotPassword },
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
      className="fr-flex fr-direction-column fr-flex-gap-8v"
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
            state={field.state.meta.errors.length ? "error" : undefined}
            stateRelatedMessage={getFieldErrorMessage(field.state.meta.errors)}
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

      <Button type="submit" disabled={forgotPassword.isPending} size="large">
        {forgotPassword.isPending ? "Envoi..." : "Réinitialiser votre mot de passe"}
      </Button>
    </form>
  );
}
