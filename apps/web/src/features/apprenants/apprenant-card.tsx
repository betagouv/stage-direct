import type { FonctionStage, StatutStage, TypeApprenant } from "~/generated/prisma/enums";
import { ApprenantFonctionBadges } from "./apprenant-fonction-badges";
import styles from "./apprenants.module.css";
import { formatStatutGlobal, formatTypeApprenant, getInitials } from "./helpers";

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
    <article className={styles.card}>
      <a href={`/apprenants/${apprenant.id}`} className={styles.cardLink}>
        <span className="fr-sr-only">
          Voir le détail de {apprenant.prenom} {apprenant.nom}
        </span>
      </a>
      <div className={styles.cardHead}>
        <span className={styles.avatar} aria-hidden="true">
          {getInitials(apprenant.prenom, apprenant.nom)}
        </span>
        <div className={styles.cardHeadInfo}>
          <p className={styles.cardName}>
            {apprenant.prenom} {apprenant.nom}
          </p>
          <p className={styles.cardSubtitle}>{formatTypeApprenant(apprenant.type)}</p>
        </div>
        <span className={styles.cardStatut}>{formatStatutGlobal(apprenant.statutGlobal)}</span>
      </div>

      <ApprenantFonctionBadges stages={apprenant.fonctions} />

      <div className={styles.cardMeta}>
        {apprenant.stagesPlanifies > 0 && (
          <span className={styles.cardMetaItem}>
            <span className="fr-icon-calendar-line" aria-hidden="true" />
            {apprenant.stagesPlanifies} {apprenant.stagesPlanifies > 1 ? "stages" : "stage"} à
            planifier
          </span>
        )}
        {apprenant.evaluationsCompletees > 0 && (
          <span className={styles.cardMetaItem}>
            <span className="fr-icon-chat-3-line" aria-hidden="true" />
            {apprenant.evaluationsCompletees}{" "}
            {apprenant.evaluationsCompletees > 1 ? "évaluations" : "évaluation"}
          </span>
        )}
        {apprenant.evaluationsEnAttente > 0 && (
          <span className={styles.cardMetaItem}>
            <span className="fr-icon-time-line" aria-hidden="true" />
            {apprenant.evaluationsEnAttente} en attente
          </span>
        )}
        <span className={styles.cardMetaArrow} aria-hidden="true">
          →
        </span>
      </div>
    </article>
  );
}
