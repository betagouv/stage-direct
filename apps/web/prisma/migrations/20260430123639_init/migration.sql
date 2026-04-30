-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'ENM', 'CRF', 'DCS', 'MDS', 'ADJ');

-- CreateEnum
CREATE TYPE "TypeApprenant" AS ENUM ('ADJ', 'CONCOURS_PRO');

-- CreateEnum
CREATE TYPE "FonctionStage" AS ENUM ('PARQUET', 'INSTRUCTION', 'JE', 'JAF', 'JAP', 'PENAL', 'CIVIL', 'JCP');

-- CreateEnum
CREATE TYPE "StatutEvaluation" AS ENUM ('ATTENDUE', 'ENVOYEE', 'EN_COURS', 'SOUMISE', 'VALIDEE', 'EN_RETARD');

-- CreateEnum
CREATE TYPE "StatutStage" AS ENUM ('PLANIFIE', 'EN_COURS', 'TERMINE', 'CLOTURE');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "telephone" TEXT,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "role" "UserRole" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "access_token" TEXT,
    "refresh_token" TEXT,
    "id_token" TEXT,
    "access_token_expires_at" TIMESTAMP(3),
    "refresh_token_expires_at" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "juridiction" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "ville" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "taille" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "juridiction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promotion" (
    "id" TEXT NOT NULL,
    "annee" INTEGER NOT NULL,
    "nom" TEXT,
    "type" "TypeApprenant" NOT NULL,
    "date_debut" TIMESTAMP(3) NOT NULL,
    "date_fin" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "promotion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dcs" (
    "id" TEXT NOT NULL,
    "binome_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "juridiction_id" TEXT NOT NULL,

    CONSTRAINT "dcs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crf" (
    "id" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "crf_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mds" (
    "id" TEXT NOT NULL,
    "fonction" "FonctionStage",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "juridiction_id" TEXT NOT NULL,

    CONSTRAINT "mds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auditeur" (
    "id" TEXT NOT NULL,
    "type" "TypeApprenant" NOT NULL,
    "cv_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "promotion_id" TEXT NOT NULL,

    CONSTRAINT "auditeur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stage" (
    "id" TEXT NOT NULL,
    "fonction" "FonctionStage" NOT NULL,
    "ordre" INTEGER NOT NULL,
    "date_debut" TIMESTAMP(3) NOT NULL,
    "date_fin" TIMESTAMP(3) NOT NULL,
    "duree" INTEGER NOT NULL,
    "statut" "StatutStage" NOT NULL DEFAULT 'PLANIFIE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "auditeur_id" TEXT NOT NULL,
    "juridiction_id" TEXT NOT NULL,
    "dcs_id" TEXT NOT NULL,
    "mds_id" TEXT,

    CONSTRAINT "stage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evaluation" (
    "id" TEXT NOT NULL,
    "statut" "StatutEvaluation" NOT NULL DEFAULT 'ATTENDUE',
    "lien_evaluation" TEXT,
    "date_envoi" TIMESTAMP(3),
    "date_reception" TIMESTAMP(3),
    "date_limite" TIMESTAMP(3),
    "contenu" JSONB,
    "commentaire" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "stage_id" TEXT NOT NULL,
    "mds_id" TEXT NOT NULL,

    CONSTRAINT "evaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evaluation_crf" (
    "id" TEXT NOT NULL,
    "auditeur_id" TEXT NOT NULL,
    "audience_numero" INTEGER NOT NULL,
    "date_audience" TIMESTAMP(3),
    "contenu" JSONB,
    "commentaire" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "crf_id" TEXT NOT NULL,

    CONSTRAINT "evaluation_crf_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "relance" (
    "id" TEXT NOT NULL,
    "date_relance" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "canal" TEXT NOT NULL DEFAULT 'EMAIL',
    "destinataire" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "evaluation_id" TEXT NOT NULL,

    CONSTRAINT "relance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alerte" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT,
    "date_echeance" TIMESTAMP(3),
    "lue" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dcs_id" TEXT NOT NULL,

    CONSTRAINT "alerte_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "circulaire" (
    "id" TEXT NOT NULL,
    "annee" INTEGER NOT NULL,
    "nom" TEXT NOT NULL,
    "contenu" JSONB,
    "fonctions" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "circulaire_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "dcs_user_id_key" ON "dcs"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "crf_user_id_key" ON "crf"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "mds_user_id_key" ON "mds"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "auditeur_user_id_key" ON "auditeur"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "evaluation_stage_id_key" ON "evaluation"("stage_id");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dcs" ADD CONSTRAINT "dcs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dcs" ADD CONSTRAINT "dcs_juridiction_id_fkey" FOREIGN KEY ("juridiction_id") REFERENCES "juridiction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crf" ADD CONSTRAINT "crf_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mds" ADD CONSTRAINT "mds_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mds" ADD CONSTRAINT "mds_juridiction_id_fkey" FOREIGN KEY ("juridiction_id") REFERENCES "juridiction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auditeur" ADD CONSTRAINT "auditeur_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auditeur" ADD CONSTRAINT "auditeur_promotion_id_fkey" FOREIGN KEY ("promotion_id") REFERENCES "promotion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stage" ADD CONSTRAINT "stage_auditeur_id_fkey" FOREIGN KEY ("auditeur_id") REFERENCES "auditeur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stage" ADD CONSTRAINT "stage_juridiction_id_fkey" FOREIGN KEY ("juridiction_id") REFERENCES "juridiction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stage" ADD CONSTRAINT "stage_dcs_id_fkey" FOREIGN KEY ("dcs_id") REFERENCES "dcs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stage" ADD CONSTRAINT "stage_mds_id_fkey" FOREIGN KEY ("mds_id") REFERENCES "mds"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluation" ADD CONSTRAINT "evaluation_stage_id_fkey" FOREIGN KEY ("stage_id") REFERENCES "stage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluation" ADD CONSTRAINT "evaluation_mds_id_fkey" FOREIGN KEY ("mds_id") REFERENCES "mds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluation_crf" ADD CONSTRAINT "evaluation_crf_crf_id_fkey" FOREIGN KEY ("crf_id") REFERENCES "crf"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relance" ADD CONSTRAINT "relance_evaluation_id_fkey" FOREIGN KEY ("evaluation_id") REFERENCES "evaluation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerte" ADD CONSTRAINT "alerte_dcs_id_fkey" FOREIGN KEY ("dcs_id") REFERENCES "dcs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
