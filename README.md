# Stage Direct

Plateforme de gestion des stages juridictionnels pour l'École Nationale de la Magistrature (ENM).

Startup d'État (Ministère de la Justice / beta.gouv) qui vise à réduire la charge administrative des DCS (Directeurs de Centre de Stage) dans les tribunaux : tableau de bord, planning, évaluations.

## Stack

- TanStack Start (SSR, file-based routing)
- React 19
- React-DSFR
- TanStack Router + TanStack Query + TanStack Form
- tRPC + Prisma (PostgreSQL)
- better-auth (email/password + magic link)
- Zod
- Vitest
- Biome

## Architecture

Monorepo pnpm avec deux packages :

```
apps/
  web/                        # Application TanStack Start
packages/
  cli/                        # CLI de maintenance (commander)
```

## Installation

```bash
pnpm install
```

## Base de données et services locaux

Les dépendances locales (PostgreSQL dev + test, MinIO pour S3, Mailpit pour les emails) sont démarrées via Docker Compose :

```bash
docker compose up -d
```

| Service | Port | Usage |
|---|---|---|
| `postgres` | 6000 | DB dev (`stage_direct`) |
| `postgres-test` | 6001 | DB tests d'intégration (`stage_direct_test`) |
| `minio` | 9000 / 9001 | S3 local (console sur 9001) |
| `mailpit` | 1025 / 8025 | SMTP de dev (UI sur 8025) |

Appliquer le schéma Prisma et générer le client :

```bash
pnpm db:push
pnpm db:generate
```

Copier le fichier d'exemple puis adapter si besoin :

```bash
cp apps/web/.env.example apps/web/.env
```

Variables principales (`apps/web/.env.example`) :

```
DATABASE_URL=postgresql://stage_direct:stage_direct@localhost:6000/stage_direct?schema=public
DATABASE_URL_TEST=postgresql://test:test@localhost:6001/stage_direct_test
BETTER_AUTH_SECRET=change-me-run-openssl-rand-base64-32
BETTER_AUTH_URL=http://localhost:3000

# S3 (MinIO en local)
S3_ENDPOINT=http://localhost:9000
S3_REGION=eu-west-3
S3_ACCESS_KEY_ID=stage_direct
S3_SECRET_ACCESS_KEY=stage_direct
S3_BUCKET=stage-direct

# Emails (Mailpit en local, Brevo en prod)
SMTP_HOST=localhost
BREVO_API_KEY=
EMAIL_FROM_ADDRESS=noreply@stage-direct.beta.gouv.fr
EMAIL_FROM_NAME=Stage Direct
```

## Commandes

À la racine :

```bash
pnpm dev          # Dev (web uniquement)
pnpm build        # Build de tous les packages
pnpm start        # Serveur SSR en production (délègue à web)
pnpm typecheck    # Typecheck sur tous les packages
pnpm lint         # Lint (Biome)
pnpm lint:fix     # Lint + autofix
pnpm format       # Format (Biome)
pnpm db:generate  # Générer le client Prisma
pnpm db:push      # Pousser le schéma vers la DB
pnpm db:studio    # Prisma Studio
```

Sur `apps/web` :

```bash
pnpm -F web dev              # Dev Vite (port 3000)
pnpm -F web build            # Build TanStack Start (sortie dans apps/web/dist/)
pnpm -F web start            # Serveur SSR en production (srvx)
pnpm -F web db:migrate:deploy # Appliquer les migrations Prisma (prod)
pnpm -F web db:seed          # Seed de la base de données
pnpm -F web test             # Vitest (tous les projets)
pnpm -F web test:unit        # Tests unitaires uniquement
pnpm -F web test:integration # Tests d'intégration (DB réelle sur port 6001)
```

## Authentification

Authentification gérée par `better-auth` avec adapter Prisma (`apps/web/src/server/providers/auth.ts`).

| Rôle | Mode de connexion |
|---|---|
| `ADJ` | Email + mot de passe |
| `DCS`, `CRF`, `MDS`, `ENM` | Magic link (email) |
| `ADMIN` | Magic link (email) |

Les magic links sont envoyés via Brevo en production, et capturés par Mailpit (http://localhost:8025) en local.

## Modèle de données

Défini dans `apps/web/prisma/schema.prisma`. Entités métier principales :

| Modèle | Description |
|---|---|
| `Juridiction` | Tribunal (nom, ville, région, taille) |
| `Promotion` | Promotion ENM (année, type ADJ ou Concours Pro) |
| `Auditeur` | Apprenant (ADJ ou Concours Pro) rattaché à une promotion |
| `Dcs` | Directeur de Centre de Stage (magistrat) rattaché à une juridiction |
| `Crf` | Coordonnateur Régional de Formation |
| `Mds` | Maître de Stage (magistrat tuteur) |
| `Stage` | Affectation d'un auditeur à une fonction sur une période |
| `Evaluation` | Évaluation d'un stage par le MDS |
| `EvaluationCrf` | Évaluation d'audience par le CRF |
| `Relance` | Trace d'une relance envoyée sur une évaluation |
| `Alerte` | Alerte affichée au DCS (évaluation en retard, etc.) |
| `Circulaire` | Trame d'évaluation (JSON) par année et fonction |

Fonctions de stage ADJ : `PARQUET`, `INSTRUCTION`, `JE`, `JAF`, `JAP`, `PENAL`, `CIVIL`, `JCP`.

Statuts d'évaluation : `ATTENDUE`, `ENVOYEE`, `EN_COURS`, `SOUMISE`, `VALIDEE`, `EN_RETARD`.

## API tRPC

Router racine dans `apps/web/src/server/router.ts`, monté sur `/api/trpc` :

| Sous-router | Responsabilité |
|---|---|
| `user` | Liste et lecture des utilisateurs |
| `juridiction` | CRUD juridictions |
| `promotion` | CRUD promotions |
| `auditeur` | CRUD auditeurs (ADJ, Concours Pro) |
| `stage` | CRUD stages (planning) |
| `evaluation` | Gestion des évaluations et relances |
| `alerte` | Alertes DCS |
| `dashboard` | Agrégations pour le tableau de bord DCS |

Le contexte tRPC (`apps/web/src/server/trpc.ts`) expose la session better-auth et le client Prisma. `protectedProcedure` exige une session active.

## Arborescence de l'application web

```
apps/web/
  prisma/
    schema.prisma              # Schéma Prisma
    seed.ts                    # Seed de base
  src/
    routes/                    # Routes TanStack (file-based)
      __root.tsx               # Layout racine (DSFR, tRPC, React Query)
      index.tsx                # Accueil
      login.tsx                # Connexion (email/password + magic link)
      api/
        -trpc.$.ts             # Handler tRPC
        auth/-$.ts             # Handler better-auth
    server/
      router.ts                # Router tRPC racine
      trpc.ts                  # Contexte + procedures (public/protected)
      handler.ts               # Handler HTTP tRPC
      routers/                 # Sous-routers métier
      providers/
        prisma.ts              # Client Prisma
        auth.ts                # Configuration better-auth
        brevo.ts               # Envoi d'emails (Brevo / SMTP)
        s3.ts                  # Client S3 (uploads CV, documents)
    lib/
      auth-client.ts           # Client better-auth côté browser
      auth-session.ts          # Helpers session SSR
    generated/prisma/          # Client Prisma généré (ne pas éditer)
    __tests__/                 # Tests d'intégration
      helpers/                 # Setup DB de test, caller tRPC
      fixtures/                # Factories de données
```

## Tests

Deux projets Vitest : `unit` (rapide, sans DB) et `integration` (DB réelle sur port 6001).

```bash
pnpm --filter web test:unit
pnpm --filter web test:integration
```

Avant les tests d'intégration, s'assurer que `postgres-test` tourne (`docker compose up -d postgres-test`) et que le schéma y est appliqué :

```bash
DATABASE_URL=$DATABASE_URL_TEST pnpm --filter web db:push
```

Les helpers `src/__tests__/helpers/` fournissent un caller tRPC authentifié et un reset de la DB entre chaque test.

## CLI

Package `packages/cli` — squelette commander pour les opérations de maintenance (imports, syncs, migrations). Les commandes seront ajoutées au fil des besoins.

```bash
pnpm --filter cli build
pnpm --filter cli dev
```

## CI/CD

Configuration CircleCI dans `.circleci/config.yml` (lint, typecheck, tests).

## Déploiement (Scalingo)

Le `Procfile` à la racine définit :

- `web` : serveur SSR TanStack Start servi par `srvx` (`pnpm --filter web start`)
- `postdeploy` : applique les migrations Prisma avant de basculer le trafic (`prisma migrate deploy`)

Scalingo exécute `pnpm install && pnpm build` au déploiement (build phase), puis lance `postdeploy`, puis démarre le process `web`.

## Maintainers

- [@KGALLET](https://github.com/KGALLET)
