import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL ?? "" });
const prisma = new PrismaClient({ adapter });

const FONCTIONS_STAGE = [
  { fonction: "PARQUET" as const, duree: 6 },
  { fonction: "INSTRUCTION" as const, duree: 5 },
  { fonction: "JE" as const, duree: 5 },
  { fonction: "JAF" as const, duree: 4 },
  { fonction: "JAP" as const, duree: 5 },
  { fonction: "PENAL" as const, duree: 3 },
  { fonction: "CIVIL" as const, duree: 4 },
  { fonction: "JCP" as const, duree: 5 },
] as const;

const JURIDICTIONS = [
  { nom: "TJ de Paris", ville: "Paris", region: "Ile-de-France", taille: "grande" },
  { nom: "TJ de Nanterre", ville: "Nanterre", region: "Ile-de-France", taille: "grande" },
  { nom: "TJ de Bobigny", ville: "Bobigny", region: "Ile-de-France", taille: "grande" },
  { nom: "TJ de Creteil", ville: "Creteil", region: "Ile-de-France", taille: "moyenne" },
  { nom: "TJ de Lyon", ville: "Lyon", region: "Auvergne-Rhone-Alpes", taille: "grande" },
  {
    nom: "TJ de Marseille",
    ville: "Marseille",
    region: "Provence-Alpes-Cote d'Azur",
    taille: "grande",
  },
  { nom: "TJ de Bordeaux", ville: "Bordeaux", region: "Nouvelle-Aquitaine", taille: "moyenne" },
  { nom: "TJ de Toulouse", ville: "Toulouse", region: "Occitanie", taille: "moyenne" },
  { nom: "TJ de Lille", ville: "Lille", region: "Hauts-de-France", taille: "moyenne" },
  { nom: "TJ de Rennes", ville: "Rennes", region: "Bretagne", taille: "moyenne" },
  { nom: "TJ de Strasbourg", ville: "Strasbourg", region: "Grand Est", taille: "moyenne" },
  { nom: "TJ de Montpellier", ville: "Montpellier", region: "Occitanie", taille: "moyenne" },
  { nom: "TJ de Nantes", ville: "Nantes", region: "Pays de la Loire", taille: "moyenne" },
  { nom: "TJ de Grenoble", ville: "Grenoble", region: "Auvergne-Rhone-Alpes", taille: "petite" },
  { nom: "TJ de Dijon", ville: "Dijon", region: "Bourgogne-Franche-Comte", taille: "petite" },
];

const PRENOMS = [
  "Marie",
  "Pierre",
  "Sophie",
  "Jean",
  "Isabelle",
  "Thomas",
  "Nathalie",
  "Laurent",
  "Sandrine",
  "Philippe",
  "Claire",
  "Francois",
  "Anne",
  "Nicolas",
  "Catherine",
  "Maxime",
  "Valentine",
  "Alexandre",
  "Camille",
  "Hugo",
  "Emma",
  "Lucas",
  "Lea",
  "Arthur",
  "Chloe",
  "Louis",
  "Manon",
  "Jules",
  "Sarah",
  "Antoine",
];

const NOMS = [
  "Martin",
  "Bernard",
  "Dubois",
  "Thomas",
  "Robert",
  "Richard",
  "Petit",
  "Durand",
  "Leroy",
  "Moreau",
  "Simon",
  "Laurent",
  "Lefebvre",
  "Michel",
  "Garcia",
  "David",
  "Bertrand",
  "Roux",
  "Vincent",
  "Fournier",
  "Morel",
  "Girard",
  "Andre",
  "Mercier",
  "Dupont",
  "Lambert",
  "Bonnet",
  "Francois",
  "Martinez",
  "Legrand",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function addWeeks(date: Date, weeks: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + weeks * 7);
  return result;
}

async function seed() {
  console.log("Nettoyage de la base...");
  await prisma.relance.deleteMany();
  await prisma.evaluation.deleteMany();
  await prisma.evaluationCrf.deleteMany();
  await prisma.alerte.deleteMany();
  await prisma.stage.deleteMany();
  await prisma.auditeur.deleteMany();
  await prisma.mds.deleteMany();
  await prisma.dcs.deleteMany();
  await prisma.crf.deleteMany();
  await prisma.promotion.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.user.deleteMany();
  await prisma.juridiction.deleteMany();
  await prisma.circulaire.deleteMany();

  // -- Circulaire --
  console.log("Creation de la circulaire...");
  await prisma.circulaire.create({
    data: {
      annee: 2026,
      nom: "Circulaire stages 2026",
      fonctions: FONCTIONS_STAGE,
    },
  });

  // -- Juridictions --
  console.log("Creation des juridictions...");
  const juridictions = await Promise.all(
    JURIDICTIONS.map((j) => prisma.juridiction.create({ data: j })),
  );

  // -- Promotion --
  console.log("Creation de la promotion...");
  const promotion = await prisma.promotion.create({
    data: {
      annee: 2026,
      nom: "Promotion 2026",
      type: "ADJ",
      dateDebut: new Date("2026-01-05"),
      dateFin: new Date("2026-10-16"),
    },
  });

  // -- CRF (2 pour le pilote Ile-de-France) --
  console.log("Creation des CRF...");
  const crfUsers: {
    user: Awaited<ReturnType<typeof prisma.user.create>>;
    crf: Awaited<ReturnType<typeof prisma.crf.create>>;
  }[] = [];
  for (let i = 0; i < 2; i++) {
    const prenom = PRENOMS[i];
    const nom = NOMS[i];
    const user = await prisma.user.create({
      data: {
        email: `crf.${prenom.toLowerCase()}.${nom.toLowerCase()}@justice.fr`,
        name: `${prenom} ${nom}`,
        role: "CRF",
        emailVerified: true,
      },
    });
    const crf = await prisma.crf.create({
      data: { userId: user.id, region: "Ile-de-France" },
    });
    crfUsers.push({ user, crf });
  }

  // -- DCS (1 par juridiction, avec compte utilisateur) --
  console.log("Creation des DCS...");
  const dcsRecords: {
    user: Awaited<ReturnType<typeof prisma.user.create>>;
    dcs: Awaited<ReturnType<typeof prisma.dcs.create>>;
    juridiction: (typeof juridictions)[number];
  }[] = [];
  for (let i = 0; i < juridictions.length; i++) {
    const prenom = PRENOMS[i + 2];
    const nom = NOMS[i + 2];
    const user = await prisma.user.create({
      data: {
        email: `dcs.${prenom.toLowerCase()}.${nom.toLowerCase()}@justice.fr`,
        name: `${prenom} ${nom}`,
        role: "DCS",
        emailVerified: true,
      },
    });
    const dcs = await prisma.dcs.create({
      data: { userId: user.id, juridictionId: juridictions[i].id },
    });
    dcsRecords.push({ user, dcs, juridiction: juridictions[i] });
  }

  // -- MDS (1 par fonction par juridiction, pas de compte user) --
  console.log("Creation des MDS...");
  const mdsMap: Record<string, Record<string, string>> = {};
  for (const jur of juridictions) {
    mdsMap[jur.id] = {};
    for (const f of FONCTIONS_STAGE) {
      const prenom = pick(PRENOMS);
      const nom = pick(NOMS);
      const mds = await prisma.mds.create({
        data: {
          nom,
          prenom,
          email: `mds.${prenom.toLowerCase()}.${nom.toLowerCase()}.${f.fonction.toLowerCase()}@justice.fr`,
          fonction: f.fonction,
          juridictionId: jur.id,
        },
      });
      mdsMap[jur.id][f.fonction] = mds.id;
    }
  }

  // -- Auditeurs (3 par juridiction = ~45 au total) --
  console.log("Creation des auditeurs et de leurs stages...");
  let auditeurIndex = 0;
  for (const dcsRecord of dcsRecords) {
    const nbAuditeurs =
      dcsRecord.juridiction.taille === "grande"
        ? 5
        : dcsRecord.juridiction.taille === "moyenne"
          ? 3
          : 2;

    for (let a = 0; a < nbAuditeurs; a++) {
      const prenom = PRENOMS[(auditeurIndex * 3 + a) % PRENOMS.length];
      const nom = NOMS[(auditeurIndex * 3 + a + 5) % NOMS.length];

      const auditeur = await prisma.auditeur.create({
        data: {
          nom,
          prenom,
          email: `adj.${prenom.toLowerCase()}.${nom.toLowerCase()}@enm.justice.fr`,
          type: "ADJ",
          promotionId: promotion.id,
        },
      });

      // Generer les 8 stages
      let currentDate = new Date("2026-01-05");
      for (let s = 0; s < FONCTIONS_STAGE.length; s++) {
        const f = FONCTIONS_STAGE[s];
        const dateDebut = new Date(currentDate);
        const dateFin = addWeeks(dateDebut, f.duree);
        const now = new Date();

        let statut: "PLANIFIE" | "EN_COURS" | "TERMINE" | "CLOTURE" = "PLANIFIE";
        if (dateFin < now) statut = "TERMINE";
        else if (dateDebut <= now && dateFin >= now) statut = "EN_COURS";

        const mdsId = mdsMap[dcsRecord.juridiction.id][f.fonction];

        const stage = await prisma.stage.create({
          data: {
            auditeurId: auditeur.id,
            fonction: f.fonction,
            ordre: s + 1,
            dateDebut,
            dateFin,
            duree: f.duree,
            statut,
            juridictionId: dcsRecord.juridiction.id,
            dcsId: dcsRecord.dcs.id,
            mdsId,
          },
        });

        // Creer une evaluation pour les stages termines ou en cours
        if (statut === "TERMINE" || statut === "EN_COURS") {
          const isReceived = statut === "TERMINE" && Math.random() > 0.3;
          await prisma.evaluation.create({
            data: {
              stageId: stage.id,
              mdsId,
              statut: isReceived ? "VALIDEE" : statut === "TERMINE" ? "EN_RETARD" : "ENVOYEE",
              dateEnvoi: addWeeks(dateDebut, f.duree - 1),
              dateLimite: addWeeks(dateFin, 2),
              dateReception: isReceived ? addWeeks(dateFin, 1) : null,
            },
          });
        }

        currentDate = dateFin;
      }
      auditeurIndex++;
    }
  }

  // -- Admin user pour le dev --
  console.log("Creation du compte admin...");
  await prisma.user.create({
    data: {
      email: "admin@stage-direct.beta.gouv.fr",
      name: "Admin Dev",
      role: "ADMIN",
      emailVerified: true,
    },
  });

  const counts = {
    juridictions: await prisma.juridiction.count(),
    dcs: await prisma.dcs.count(),
    crf: await prisma.crf.count(),
    mds: await prisma.mds.count(),
    auditeurs: await prisma.auditeur.count(),
    stages: await prisma.stage.count(),
    evaluations: await prisma.evaluation.count(),
    users: await prisma.user.count(),
  };

  console.log("\nSeed termine !");
  console.log(counts);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
