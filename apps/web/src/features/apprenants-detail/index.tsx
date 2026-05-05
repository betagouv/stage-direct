import { Breadcrumb } from "@codegouvfr/react-dsfr/Breadcrumb";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { Route } from "~/routes/(authenticated)/_auth/apprenants_.$id";
import { useTRPC } from "~/utils/trpc";
import { ApprenantDetailHeader } from "./components/header/apprenant-detail-header";
import { ApprenantDetailPlanning } from "./components/planning/apprenant-detail-planning";
import { ApprenantDetailSummary } from "./components/summary/apprenant-detail-summary";
import styles from "./page.module.css";

export function ApprenantDetailPage() {
  const { id } = Route.useParams();
  const trpc = useTRPC();
  const { data } = useQuery(trpc.auditeur.byId.queryOptions({ id }));

  if (!data) return null;

  return (
    <div className={clsx(styles.pageWrapper, "fr-height-full")}>
      <div className="fr-container fr-py-4w">
        <Breadcrumb
          currentPageLabel={`${data.prenom} ${data.nom}`}
          className="fr-mb-0"
          segments={[
            { label: "Tableau de bord", linkProps: { href: "/tableau-de-bord" } },
            { label: "Apprenants", linkProps: { href: "/apprenants" } },
          ]}
        />
        <ApprenantDetailHeader apprenant={data} />
        <ApprenantDetailSummary stages={data.stages} />
        <ApprenantDetailPlanning />
      </div>
    </div>
  );
}
