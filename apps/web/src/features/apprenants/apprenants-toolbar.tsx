import { Select } from "@codegouvfr/react-dsfr/SelectNext";
import clsx from "clsx";
import styles from "./apprenants.module.css";

export type StatutFilter = "ALL" | "EN_COURS" | "EN_ATTENTE" | "TERMINE";
export type SortValue = "nom_asc" | "nom_desc";

type Props = {
  total: number;
  search: string;
  onSearchChange: (value: string) => void;
  statut: StatutFilter;
  onStatutChange: (value: StatutFilter) => void;
  sort: SortValue;
  onSortChange: (value: SortValue) => void;
};

const STATUT_OPTIONS: { value: StatutFilter; label: string }[] = [
  { value: "ALL", label: "Tous" },
  { value: "EN_COURS", label: "Stage en cours" },
  { value: "EN_ATTENTE", label: "En attente" },
  { value: "TERMINE", label: "Terminé" },
];

export function ApprenantsToolbar({
  total,
  search,
  onSearchChange,
  statut,
  onStatutChange,
  sort,
  onSortChange,
}: Props) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.toolbarLeft}>
        <p className={styles.counter}>
          {total} {total > 1 ? "apprenants" : "apprenant"}
        </p>
        <Select
          label=""
          nativeSelectProps={{
            value: sort,
            onChange: (e) => onSortChange(e.target.value as SortValue),
            "aria-label": "Trier les apprenants",
          }}
          options={[
            { value: "nom_asc", label: "Triés de A à Z" },
            { value: "nom_desc", label: "Triés de Z à A" },
          ]}
        />
      </div>
      <div className={styles.toolbarRight}>
        <div className={styles.statutTabs} role="tablist" aria-label="Filtrer par statut de stage">
          {STATUT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              role="tab"
              aria-selected={statut === opt.value}
              className={clsx(styles.statutTab, statut === opt.value && styles.statutTabActive)}
              onClick={() => onStatutChange(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <input
          type="search"
          className={clsx("fr-input", styles.searchInput)}
          placeholder="Nom ou prénom"
          aria-label="Rechercher un apprenant par nom ou prénom"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}
