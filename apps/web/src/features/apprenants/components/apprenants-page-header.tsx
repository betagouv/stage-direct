import { Breadcrumb } from "@codegouvfr/react-dsfr/Breadcrumb";
import Ecosystem from "@codegouvfr/react-dsfr/picto/Ecosystem";
import { SegmentedControl } from "@codegouvfr/react-dsfr/SegmentedControl";
import { formatPerimetreLabel } from "../helpers";

type Perimetre =
  | { type: "DCS"; juridiction: { nom: string } }
  | { type: "CRF"; region: string }
  | { type: "ENM" };

type Props = {
  perimetre: Perimetre | undefined;
  type: "ALL" | "ADJ" | "CONCOURS_PRO";
  onTypeChange: (type: "ALL" | "ADJ" | "CONCOURS_PRO") => void;
};

export function ApprenantsPageHeader({ perimetre, type, onTypeChange }: Props) {
  return (
    <>
      <Breadcrumb
        currentPageLabel="Apprenants"
        className="fr-mb-0"
        segments={[{ label: "Tableau de bord", linkProps: { href: "/tableau-de-bord" } }]}
      />
      <div className="fr-flex fr-flex-wrap fr-justify-content-space-between fr-align-items-center fr-flex-gap-6v fr-py-3w fr-mb-4w fr-border-bottom">
        <div className="fr-flex fr-align-items-center fr-flex-gap-5v">
          <Ecosystem color="blue-ecume" width={80} height={80} />
          <div>
            <h1 className="fr-mb-0">Apprenants</h1>
            {perimetre && (
              <p className="fr-text-mention--grey">{formatPerimetreLabel(perimetre)}</p>
            )}
          </div>
        </div>
        <SegmentedControl
          name="type-apprenant"
          legend="Type d'apprenant"
          hideLegend
          segments={[
            {
              label: "Tous",
              nativeInputProps: {
                checked: type === "ALL",
                onChange: () => onTypeChange("ALL"),
              },
            },
            {
              label: "ADJ",
              nativeInputProps: {
                checked: type === "ADJ",
                onChange: () => onTypeChange("ADJ"),
              },
            },
            {
              label: "SCP",
              nativeInputProps: {
                checked: type === "CONCOURS_PRO",
                onChange: () => onTypeChange("CONCOURS_PRO"),
              },
            },
          ]}
        />
      </div>
    </>
  );
}
