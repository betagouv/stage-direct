import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Select } from "@codegouvfr/react-dsfr/Select";
import { useForm } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PasswordInput } from "../components/password-input";
import { RoleTabs } from "./role-tabs";
import { listJuridictions, listRegions } from "./server/list-juridictions.fn";
import { type SignUpRole, ZSignUp } from "./server/schemas/sign-up";
import { useSignUp } from "./server/use-sign-up";

export function SignUpForm() {
  const [role, setRole] = useState<SignUpRole>("DCS");
  const signUp = useSignUp();

  const juridictionsQuery = useQuery({
    queryKey: ["juridictions"],
    queryFn: () => listJuridictions(),
  });
  const regionsQuery = useQuery({
    queryKey: ["regions"],
    queryFn: () => listRegions(),
    enabled: role === "CRF",
  });

  const form = useForm({
    defaultValues: {
      email: "",
      nom: "",
      prenom: "",
      password: "",
      juridictionId: "",
      region: "",
    },
    onSubmit: async ({ value }) => {
      const base = {
        email: value.email,
        nom: value.nom,
        prenom: value.prenom,
        password: value.password,
      };
      const input =
        role === "CRF"
          ? { ...base, role: "CRF" as const, region: value.region }
          : { ...base, role, juridictionId: value.juridictionId };

      const parsed = ZSignUp.safeParse(input);
      if (!parsed.success) {
        throw new Error(parsed.error.issues.map((i) => i.message).join(", "));
      }
      await signUp.mutateAsync(parsed.data);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
    >
      <div>
        <h1 style={{ marginBottom: "0.25rem" }}>Créer un compte StageDirect</h1>
        <p className="fr-text--sm" style={{ color: "var(--text-mention-grey)" }}>
          Tous les champs du formulaire sont obligatoires.
        </p>
      </div>

      <div>
        <p className="fr-text--sm fr-mb-1w" style={{ fontWeight: 700 }}>
          Vous êtes
        </p>
        <p className="fr-text--xs fr-mb-1w" style={{ color: "var(--text-mention-grey)" }}>
          Sélectionnez votre statut par rapport à l'institution judiciaire
        </p>
        <RoleTabs value={role} onChange={setRole} />
      </div>

      <form.Field name="email">
        {(field) => (
          <Input
            label="E-mail (@justice.fr)"
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

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <form.Field name="nom">
          {(field) => (
            <Input
              label="Nom"
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
        <form.Field name="prenom">
          {(field) => (
            <Input
              label="Prénom"
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
      </div>

      <form.Field name="password">
        {(field) => (
          <PasswordInput
            label="Mot de passe"
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

      {role === "CRF" ? (
        <form.Field name="region">
          {(field) => (
            <Select
              label="Région"
              state={field.state.meta.errors.length ? "error" : undefined}
              stateRelatedMessage={String(field.state.meta.errors[0] ?? "")}
              nativeSelectProps={{
                name: field.name,
                value: field.state.value,
                onBlur: field.handleBlur,
                onChange: (e) => field.handleChange(e.target.value),
              }}
            >
              <option value="">Sélectionnez une région</option>
              {regionsQuery.data?.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </Select>
          )}
        </form.Field>
      ) : (
        <form.Field name="juridictionId">
          {(field) => (
            <Select
              label="Cours d'appel / Juridiction"
              state={field.state.meta.errors.length ? "error" : undefined}
              stateRelatedMessage={String(field.state.meta.errors[0] ?? "")}
              nativeSelectProps={{
                name: field.name,
                value: field.state.value,
                onBlur: field.handleBlur,
                onChange: (e) => field.handleChange(e.target.value),
              }}
            >
              <option value="">Sélectionnez une juridiction</option>
              {juridictionsQuery.data?.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.nom}
                </option>
              ))}
            </Select>
          )}
        </form.Field>
      )}

      {signUp.isError && (
        <Alert
          severity="error"
          small
          description={signUp.error instanceof Error ? signUp.error.message : "Erreur"}
        />
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <Button type="submit" disabled={signUp.isPending}>
          {signUp.isPending ? "Création..." : "Créer un compte"}
        </Button>
        <a
          href="mailto:contact@stage-direct.beta.gouv.fr"
          className="fr-link"
        >
          Besoin d'aide ?
        </a>
      </div>
    </form>
  );
}
