import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { useForm } from "@tanstack/react-form";
import { ZForgotPassword } from "./server/schemas/forgot-password";
import { useForgotPassword } from "./server/use-forgot-password";

export function ForgotPasswordForm() {
  const forgotPassword = useForgotPassword();

  const form = useForm({
    defaultValues: { email: "" },
    onSubmit: async ({ value }) => {
      const parsed = ZForgotPassword.safeParse(value);
      if (!parsed.success) {
        throw new Error(parsed.error.issues.map((i) => i.message).join(", "));
      }
      await forgotPassword.mutateAsync(parsed.data);
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

      <Button type="submit" disabled={forgotPassword.isPending} iconId="fr-icon-arrow-right-line" iconPosition="right">
        {forgotPassword.isPending ? "Envoi..." : "Envoyer le lien de réinitialisation"}
      </Button>

      {forgotPassword.isSuccess && (
        <Alert
          severity="success"
          small
          description="Si un compte existe pour cet email, un lien de réinitialisation vient d'être envoyé."
        />
      )}
      {forgotPassword.isError && (
        <Alert
          severity="error"
          small
          description={forgotPassword.error instanceof Error ? forgotPassword.error.message : "Erreur"}
        />
      )}
    </form>
  );
}
