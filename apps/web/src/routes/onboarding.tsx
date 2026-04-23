import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Select } from "@codegouvfr/react-dsfr/Select";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { AuthLayout } from "~/features/authentification/components/auth-layout";
import { RoleTabs } from "~/features/authentification/s-inscrire/role-tabs";
import {
  listJuridictions,
  listRegions,
} from "~/features/authentification/s-inscrire/server/list-juridictions.fn";
import type { SignUpRole } from "~/features/authentification/s-inscrire/server/schemas/sign-up";
import { setUserRoleAndProfile } from "~/features/authentification/s-inscrire/server/set-user-role-and-profile.fn";

export const Route = createFileRoute("/onboarding")({
  beforeLoad: ({ context: { session } }) => {
    if (!session) {
      throw redirect({ to: "/se-connecter" });
    }
    if (session.user.role) {
      throw redirect({ to: "/" });
    }
  },
  component: OnboardingPage,
});

function OnboardingPage() {
  const { session } = Route.useRouteContext();
  const router = useRouter();
  const [role, setRole] = useState<SignUpRole>("DCS");
  const [juridictionId, setJuridictionId] = useState("");
  const [region, setRegion] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");

  const juridictionsQuery = useQuery({
    queryKey: ["juridictions"],
    queryFn: () => listJuridictions(),
  });
  const regionsQuery = useQuery({
    queryKey: ["regions"],
    queryFn: () => listRegions(),
    enabled: role === "CRF",
  });

  const mutation = useMutation({
    mutationFn: async () => {
      if (role === "CRF") {
        await setUserRoleAndProfile({ data: { role: "CRF", region } });
      } else if (role === "MDS") {
        await setUserRoleAndProfile({
          data: { role: "MDS", juridictionId, nom, prenom },
        });
      } else {
        await setUserRoleAndProfile({ data: { role: "DCS", juridictionId } });
      }
      await router.invalidate();
      router.navigate({ to: "/" });
    },
  });

  const userEmail = session?.user.email ?? "";
  const userName = session?.user.name ?? "";

  return (
    <AuthLayout>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate();
        }}
        style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
      >
        <div>
          <h1>Finalisez votre profil</h1>
          <p style={{ color: "var(--text-mention-grey)" }}>
            Bienvenue {userName}. Indiquez votre statut pour accéder à StageDirect.
          </p>
        </div>

        <Input
          label="E-mail"
          disabled
          nativeInputProps={{ value: userEmail, readOnly: true }}
        />

        <div>
          <p className="fr-text--sm fr-mb-1w" style={{ fontWeight: 700 }}>
            Vous êtes
          </p>
          <RoleTabs value={role} onChange={setRole} />
        </div>

        {role === "MDS" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Input
              label="Nom"
              nativeInputProps={{ value: nom, onChange: (e) => setNom(e.target.value) }}
            />
            <Input
              label="Prénom"
              nativeInputProps={{ value: prenom, onChange: (e) => setPrenom(e.target.value) }}
            />
          </div>
        )}

        {role === "CRF" ? (
          <Select
            label="Région"
            nativeSelectProps={{
              value: region,
              onChange: (e) => setRegion(e.target.value),
            }}
          >
            <option value="">Sélectionnez une région</option>
            {regionsQuery.data?.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Select>
        ) : (
          <Select
            label="Cours d'appel / Juridiction"
            nativeSelectProps={{
              value: juridictionId,
              onChange: (e) => setJuridictionId(e.target.value),
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

        {mutation.isError && (
          <Alert
            severity="error"
            small
            description={mutation.error instanceof Error ? mutation.error.message : "Erreur"}
          />
        )}

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Enregistrement..." : "Finaliser mon profil"}
        </Button>
      </form>
    </AuthLayout>
  );
}
