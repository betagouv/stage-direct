import { Breadcrumb } from "@codegouvfr/react-dsfr/Breadcrumb";
import { SegmentedControl } from "@codegouvfr/react-dsfr/SegmentedControl";
import styles from "./apprenants.module.css";
import { formatPerimetreLabel } from "./helpers";

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
        segments={[{ label: "Tableau de bord", linkProps: { href: "/tableau-de-bord" } }]}
      />
      <div className={styles.headerRow}>
        <div className={styles.headerTitle}>
          <span
            className="fr-icon-team-line"
            aria-hidden="true"
            style={{ fontSize: "2rem", color: "var(--text-action-high-blue-france)" }}
          />
          <div className={styles.headerTitleText}>
            <h1>Apprenants</h1>
            {perimetre && (
              <p className={styles.headerSubtitle}>{formatPerimetreLabel(perimetre)}</p>
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
