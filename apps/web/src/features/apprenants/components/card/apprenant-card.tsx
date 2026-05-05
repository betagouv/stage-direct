import { Link } from "@tanstack/react-router";
import clsx from "clsx";
import type { FonctionStage, StatutStage, TypeApprenant } from "~/generated/prisma/enums";
import { sPluriel } from "~/utils/sPluriel";
import { formatStatutGlobal, formatTypeApprenant } from "../../helpers";
import { ApprenantAvatar } from "../avatar/apprenant-avatar";
import { ApprenantFonctionBadges } from "../badge/apprenant-fonction-badges";
import styles from "./apprenant-card.module.css";

export type ApprenantCardData = {
  id: string;
  nom: string;
  prenom: string;
  type: TypeApprenant;
  statutGlobal: "EN_COURS" | "EN_ATTENTE" | "TERMINE";
  stagesPlanifies: number;
  evaluationsCompletees: number;
  evaluationsEnAttente: number;
  fonctions: { fonction: FonctionStage; statut: StatutStage }[];
};

export function ApprenantCard({ apprenant }: { apprenant: ApprenantCardData }) {
  return (
    <article
      className={clsx(
        styles.card,
        "fr-background-default--grey fr-position-relative fr-border fr-flex fr-direction-column fr-p-7v fr-flex-gap-6v fr-background",
      )}
    >
      <div className="fr-flex fr-flex-gap-4v fr-align-items-center">
        <ApprenantAvatar prenom={apprenant.prenom} nom={apprenant.nom} />
        <div className={styles.cardHeadInfo}>
          <p className="fr-h5 fr-mb-0 fr-text-title--blue-france">
            <Link to="/apprenants/$id" params={{ id: apprenant.id }} className={styles.cardLink}>
              {apprenant.prenom} {apprenant.nom}
            </Link>
          </p>
          <p className="fr-text--sm fr-text-mention--grey fr-mb-0">
            {formatTypeApprenant(apprenant.type)}
          </p>
        </div>
        <span className="fr-text-mention--grey fr-text--italic fr-text--sm fr-mb-0">
          {formatStatutGlobal(apprenant.statutGlobal)}
        </span>
      </div>

      <ApprenantFonctionBadges stages={apprenant.fonctions} />

      <div className="fr-flex fr-flex-gap-4v fr-flex-wrap fr-align-items-center fr-text-mention--grey fr-text--sm fr-mb-0">
        {apprenant.stagesPlanifies > 0 && (
          <span className="fr-inline-flex fr-align-items-center fr-flex-gap-2v">
            <span className="ri-calendar-event-line fr-icon--sm" aria-hidden="true" />
            {apprenant.stagesPlanifies} stage{sPluriel(apprenant.stagesPlanifies)} à planifier
          </span>
        )}
        {apprenant.evaluationsCompletees > 0 && (
          <span className="fr-inline-flex fr-align-items-center fr-flex-gap-2v">
            <span className="ri-chat-3-line fr-icon--sm" aria-hidden="true" />
            {apprenant.evaluationsCompletees} évaluation{sPluriel(apprenant.evaluationsCompletees)}
          </span>
        )}
        {apprenant.evaluationsEnAttente > 0 && (
          <span className="fr-inline-flex fr-align-items-center fr-flex-gap-2v">
            <span className="ri-chat-history-line fr-icon--sm" aria-hidden="true" />
            {apprenant.evaluationsEnAttente} en attente
          </span>
        )}
        <span className={clsx(styles.cardMetaArrow, "ri-arrow-right-line")} aria-hidden="true" />
      </div>
    </article>
  );
}
