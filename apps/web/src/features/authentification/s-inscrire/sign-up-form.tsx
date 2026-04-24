import { Button } from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Select } from "@codegouvfr/react-dsfr/Select";
import { useForm } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import { getFieldErrorProps } from "~/utils/form-errors";
import { useTRPC } from "~/utils/trpc";
import { PasswordInput } from "../components/password-input";
import { RoleTabs } from "./role-tabs";
import { type SignUpRole, ZSignUp } from "./server/schemas/sign-up";
import { useSignUp } from "./server/use-sign-up";

export function SignUpForm() {
  const signUp = useSignUp();
  const trpc = useTRPC();
  const juridictionsQuery = useQuery(trpc.authentification.listJuridictions.queryOptions());
  const regionsQuery = useQuery(trpc.authentification.listRegions.queryOptions());

  const form = useForm({
    defaultValues: {
      role: "DCS" as SignUpRole,
      email: "",
      nom: "",
      prenom: "",
      password: "",
      juridictionId: "",
      region: "",
    },
    validators: { onChange: ZSignUp },
    onSubmit: async ({ value }) => {
      await signUp.mutateAsync(value);
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
        <h1 className="fr-h3 fr-mb-1v">Créer un compte StageDirect</h1>
        <p className="fr-text--sm fr-mb-0">Tous les champs du formulaire sont obligatoires.</p>
      </div>
      <hr className="fr-py-0" style={{ height: 1 }} />
      <form.Field name="role">
        {(field) => (
          <div>
            <p className="fr-mb-1w">Vous êtes</p>
            <p className="fr-text--xs fr-mb-1w fr-text-mention--grey">
              Sélectionnez votre statut par rapport à l'institution judiciaire
            </p>
            <RoleTabs value={field.state.value} onChange={(role) => field.handleChange(role)} />
          </div>
        )}
      </form.Field>

      <form.Field name="email">
        {(field) => (
          <Input
            classes={{ root: "fr-mb-0" }}
            label={
              <>
                E-mail (@justice.fr) <span className="fr-text-default--error">*</span>
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

      <div className="fr-grid-row fr-grid-row--gutters">
        <div className="fr-col-12 fr-col-md-6">
          <form.Field name="nom">
            {(field) => (
              <Input
                classes={{ root: "fr-mb-0" }}
                label={
                  <>
                    Nom <span className="fr-text-default--error">*</span>
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
        </div>
        <div className="fr-col-12 fr-col-md-6">
          <form.Field name="prenom">
            {(field) => (
              <Input
                classes={{ root: "fr-mb-0" }}
                label={
                  <>
                    Prénom <span className="fr-text-default--error">*</span>
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
        </div>
      </div>

      <form.Field name="password">
        {(field) => (
          <PasswordInput
            classes={{ root: "fr-mb-0" }}
            label={
              <>
                Mot de passe <span className="fr-text-default--error">*</span>
              </>
            }
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

      <form.Subscribe selector={(s) => s.values.role}>
        {(role) =>
          role === "CRF" ? (
            <form.Field name="region">
              {(field) => (
                <Select
                  label={
                    <>
                      Région <span className="fr-text-default--error">*</span>
                    </>
                  }
                  {...getFieldErrorProps(field.state.meta)}
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
                  label={
                    <>
                      Cours d'appel / Juridiction <span className="fr-text-default--error">*</span>
                    </>
                  }
                  {...getFieldErrorProps(field.state.meta)}
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

      <div className="fr-flex fr-justify-content-space-between fr-align-items-center fr-flex-wrap fr-flex-gap-4v">
        <Button type="submit" disabled={signUp.isPending} size="large">
          {signUp.isPending ? "Création..." : "Créer un compte"}
        </Button>
        <a href="mailto:contact@stage-direct.beta.gouv.fr" className="fr-link">
          Besoin d'aide ?
        </a>
      </div>
    </form>
  );
}
