import { Button } from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { SegmentedControl } from "@codegouvfr/react-dsfr/SegmentedControl";
import { Select } from "@codegouvfr/react-dsfr/SelectNext";
import { sPluriel } from "~/utils/sPluriel";

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
    <div className="fr-flex fr-align-items-center fr-justify-content-space-between fr-flex-nowrap fr-flex-gap-4v fr-mb-3w">
      <div className="fr-flex fr-flex-gap-4v fr-align-items-center">
        <p className="fr-h4 fr-mb-0">
          {total} apprenant{sPluriel(total)}
        </p>
        <Select
          label=""
          className="fr-mb-0"
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
      <div className="fr-flex fr-flex-gap-4v fr-align-items-end">
        <SegmentedControl
          name="statut-filter"
          legend="Filtrer par statut de stage"
          hideLegend
          segments={[
            {
              label: "Tous",
              nativeInputProps: {
                checked: statut === "ALL",
                onChange: () => onStatutChange("ALL"),
              },
            },
            {
              label: "Stage en cours",
              nativeInputProps: {
                checked: statut === "EN_COURS",
                onChange: () => onStatutChange("EN_COURS"),
              },
            },
            {
              label: "En attente",
              nativeInputProps: {
                checked: statut === "EN_ATTENTE",
                onChange: () => onStatutChange("EN_ATTENTE"),
              },
            },
            {
              label: "Terminé",
              nativeInputProps: {
                checked: statut === "TERMINE",
                onChange: () => onStatutChange("TERMINE"),
              },
            },
          ]}
        />
        <div className="fr-flex-shrink-0">
          <Input
            label="Nom ou prénom"
            hideLabel
            addon={<Button iconId="fr-icon-search-line" priority="primary" title="Recherche" />}
            nativeInputProps={{
              type: "search",
              placeholder: "Nom ou prénom",
              value: search,
              onChange: (e) => onSearchChange(e.target.value),
            }}
          />
        </div>
      </div>
    </div>
  );
}
