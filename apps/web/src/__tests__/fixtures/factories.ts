import type { FonctionStage, TypeApprenant, UserRole } from "~/generated/prisma/enums";
import { getTestDb } from "../helpers/test-db";

export async function createUser(
  overrides: {
    id?: string;
    email?: string;
    name?: string;
    nom?: string;
    prenom?: string;
    telephone?: string;
    role?: UserRole;
  } = {},
) {
  const db = getTestDb();
  return db.user.create({
    data: {
      email: overrides.email ?? `stagedirect-user-${Date.now()}@justice.fr`,
      name: overrides.name ?? "Test User",
      nom: overrides.nom ?? "User",
      prenom: overrides.prenom ?? "Test",
      telephone: overrides.telephone,
      role: overrides.role ?? "DCS",
      emailVerified: true,
      ...(overrides.id ? { id: overrides.id } : {}),
    },
  });
}

export async function createJuridiction(
  overrides: { nom?: string; ville?: string; region?: string; taille?: string } = {},
) {
  const db = getTestDb();
  return db.juridiction.create({
    data: {
      nom: overrides.nom ?? "TJ de Test",
      ville: overrides.ville ?? "Testville",
      region: overrides.region ?? "Ile-de-France",
      taille: overrides.taille ?? "moyenne",
    },
  });
}

export async function createDcs(overrides: { userId: string; juridictionId: string }) {
  const db = getTestDb();
  return db.dcs.create({ data: overrides });
}

export async function createCrf(overrides: { userId: string; region?: string }) {
  const db = getTestDb();
  return db.crf.create({
    data: {
      userId: overrides.userId,
      region: overrides.region ?? "Ile-de-France",
    },
  });
}

export async function createMds(overrides: {
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  fonction?: FonctionStage;
  juridictionId: string;
}) {
  const db = getTestDb();
  const nom = overrides.nom ?? "Dupont";
  const prenom = overrides.prenom ?? "Marie";
  const email = overrides.email ?? `stagedirect-mds-${Date.now()}@justice.fr`;
  const { fonction, juridictionId, telephone } = overrides;
  return db.mds.create({
    data: {
      fonction: fonction ?? "PARQUET",
      juridiction: { connect: { id: juridictionId } },
      user: {
        create: {
          email,
          nom,
          prenom,
          telephone,
          name: `${prenom} ${nom}`.trim(),
          role: "MDS" as UserRole,
          emailVerified: true,
        },
      },
    },
  });
}

export async function createPromotion(
  overrides: {
    annee?: number;
    nom?: string;
    type?: TypeApprenant;
    dateDebut?: Date;
    dateFin?: Date;
  } = {},
) {
  const db = getTestDb();
  return db.promotion.create({
    data: {
      annee: overrides.annee ?? 2026,
      nom: overrides.nom ?? "Promotion Test",
      type: overrides.type ?? "ADJ",
      dateDebut: overrides.dateDebut ?? new Date("2026-01-05"),
      dateFin: overrides.dateFin ?? new Date("2026-10-16"),
    },
  });
}

export async function createAuditeur(overrides: {
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  type?: TypeApprenant;
  promotionId: string;
}) {
  const db = getTestDb();
  const nom = overrides.nom ?? "Martin";
  const prenom = overrides.prenom ?? "Maxime";
  const email = overrides.email ?? `stagedirect-adj-${Date.now()}@justice.fr`;
  const { promotionId, type, telephone } = overrides;
  return db.auditeur.create({
    data: {
      type: type ?? "ADJ",
      promotion: { connect: { id: promotionId } },
      user: {
        create: {
          email,
          nom,
          prenom,
          telephone,
          name: `${prenom} ${nom}`.trim(),
          role: "ADJ" as UserRole,
          emailVerified: true,
        },
      },
    },
  });
}

export async function createStage(overrides: {
  auditeurId: string;
  fonction?: FonctionStage;
  ordre?: number;
  dateDebut?: Date;
  dateFin?: Date;
  duree?: number;
  juridictionId: string;
  dcsId: string;
  mdsId?: string;
}) {
  const db = getTestDb();
  return db.stage.create({
    data: {
      auditeurId: overrides.auditeurId,
      fonction: overrides.fonction ?? "PARQUET",
      ordre: overrides.ordre ?? 1,
      dateDebut: overrides.dateDebut ?? new Date("2026-01-05"),
      dateFin: overrides.dateFin ?? new Date("2026-02-16"),
      duree: overrides.duree ?? 6,
      juridictionId: overrides.juridictionId,
      dcsId: overrides.dcsId,
      mdsId: overrides.mdsId,
    },
  });
}

export async function createEvaluation(overrides: {
  stageId: string;
  mdsId: string;
  statut?: "ATTENDUE" | "ENVOYEE" | "EN_COURS" | "SOUMISE" | "VALIDEE" | "EN_RETARD";
}) {
  const db = getTestDb();
  return db.evaluation.create({
    data: {
      stageId: overrides.stageId,
      mdsId: overrides.mdsId,
      statut: overrides.statut ?? "ATTENDUE",
    },
  });
}
