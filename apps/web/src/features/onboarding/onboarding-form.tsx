import { Button } from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Select } from "@codegouvfr/react-dsfr/Select";
import { useForm } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "~/utils/trpc";
import { RoleTabs } from "../authentification/s-inscrire/role-tabs";
import { type OnboardingRole, ZOnboarding } from "./server/schemas/onboarding";
import { useOnboarding } from "./server/use-onboarding";

type OnboardingFormProps = {
  userEmail: string;
  userName: string;
};

export function OnboardingForm({ userEmail, userName }: OnboardingFormProps) {
  const onboarding = useOnboarding();
  const trpc = useTRPC();
  const juridictionsQuery = useQuery(trpc.authentification.listJuridictions.queryOptions());
  const regionsQuery = useQuery(trpc.authentification.listRegions.queryOptions());

  const form = useForm({
    defaultValues: {
      role: "DCS" as OnboardingRole,
      juridictionId: "",
      region: "",
      nom: "",
      prenom: "",
    },
    validators: {
      onSubmit: ({ value }) => {
        const input =
          value.role === "CRF"
            ? { role: "CRF" as const, region: value.region }
            : value.role === "MDS"
              ? {
                  role: "MDS" as const,
                  juridictionId: value.juridictionId,
                  nom: value.nom,
                  prenom: value.prenom,
                }
              : { role: "DCS" as const, juridictionId: value.juridictionId };
        const parsed = ZOnboarding.safeParse(input);
        return parsed.success ? undefined : parsed.error.issues[0]?.message;
      },
    },
    onSubmit: async ({ value }) => {
      const payload =
        value.role === "CRF"
          ? { role: "CRF" as const, region: value.region }
          : value.role === "MDS"
            ? {
                role: "MDS" as const,
                juridictionId: value.juridictionId,
                nom: value.nom,
                prenom: value.prenom,
              }
            : { role: "DCS" as const, juridictionId: value.juridictionId };
      await onboarding.mutateAsync(payload);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="fr-flex fr-direction-column fr-flex-gap-5v"
    >
      <div>
        <h1>Finalisez votre profil</h1>
        <p className="fr-text-mention--grey">
          Bienvenue {userName}. Indiquez votre statut pour accéder à StageDirect.
        </p>
      </div>

      <Input label="E-mail" disabled nativeInputProps={{ value: userEmail, readOnly: true }} />

      <form.Field name="role">
        {(field) => (
          <div>
            <p className="fr-text--sm fr-mb-1w fr-text--bold">Vous êtes</p>
            <RoleTabs value={field.state.value} onChange={(r) => field.handleChange(r)} />
          </div>
        )}
      </form.Field>

      <form.Subscribe selector={(s) => s.values.role}>
        {(role) =>
          role === "MDS" ? (
            <div className="fr-grid-row fr-grid-row--gutters">
              <div className="fr-col-12 fr-col-md-6">
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
              </div>
              <div className="fr-col-12 fr-col-md-6">
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
            </div>
          ) : null
        }
      </form.Subscribe>

      <form.Subscribe selector={(s) => s.values.role}>
        {(role) =>
          role === "CRF" ? (
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
          )
        }
      </form.Subscribe>

      <Button type="submit" disabled={onboarding.isPending}>
        {onboarding.isPending ? "Enregistrement..." : "Finaliser mon profil"}
      </Button>
    </form>
  );
}
