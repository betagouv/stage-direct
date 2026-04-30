import { Pagination } from "@codegouvfr/react-dsfr/Pagination";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { Route } from "~/routes/(authenticated)/_auth/apprenants";
import { useTRPC } from "~/utils/trpc";
import { ApprenantCard } from "./apprenant-card";
import styles from "./apprenants.module.css";
import { ApprenantsPageHeader } from "./apprenants-page-header";
import { ApprenantsToolbar, type SortValue, type StatutFilter } from "./apprenants-toolbar";

export function ApprenantsPage() {
  const navigate = Route.useNavigate();
  const { type, statut, sort, page } = Route.useSearch();
  const trpc = useTRPC();

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch] = useDebounceValue(searchInput, 300);

  const { data, isFetching } = useQuery(
    trpc.auditeur.listForGestionnaire.queryOptions({
      type,
      statut,
      sort,
      page,
      pageSize: 8,
      search: debouncedSearch || undefined,
    }),
  );

  return (
    <div className={styles.pageWrapper}>
      <div className="fr-container fr-py-4w">
        <ApprenantsPageHeader
          perimetre={data?.perimetre}
          type={type}
          onTypeChange={(value) =>
            navigate({ search: (prev) => ({ ...prev, type: value, page: 1 }) })
          }
        />

        <ApprenantsToolbar
          total={data?.total ?? 0}
          search={searchInput}
          onSearchChange={setSearchInput}
          statut={statut}
          onStatutChange={(value: StatutFilter) =>
            navigate({ search: (prev) => ({ ...prev, statut: value, page: 1 }) })
          }
          sort={sort}
          onSortChange={(value: SortValue) =>
            navigate({ search: (prev) => ({ ...prev, sort: value, page: 1 }) })
          }
        />

        {!data && isFetching ? (
          <p>Chargement…</p>
        ) : data && data.items.length === 0 ? (
          <div className={styles.empty}>Aucun apprenant ne correspond à ces filtres.</div>
        ) : data ? (
          <div className={styles.list}>
            {data.items.map((apprenant) => (
              <ApprenantCard key={apprenant.id} apprenant={apprenant} />
            ))}
          </div>
        ) : null}

        {data && data.pageCount > 1 && (
          <div className={styles.pagination}>
            <Pagination
              count={data.pageCount}
              defaultPage={data.page}
              getPageLinkProps={(pageNumber) => ({
                href: "#",
                onClick: (e) => {
                  e.preventDefault();
                  navigate({ search: (prev) => ({ ...prev, page: pageNumber }) });
                },
              })}
            />
          </div>
        )}
      </div>
    </div>
  );
}
