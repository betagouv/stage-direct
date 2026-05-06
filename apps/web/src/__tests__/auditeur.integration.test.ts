import { describe, expect, it } from "vitest";
import {
  createAuditeur,
  createCrf,
  createDcs,
  createEvaluation,
  createJuridiction,
  createMds,
  createPromotion,
  createStage,
  createUser,
} from "./fixtures/factories";
import "./helpers/setup-integration";
import {
  adjCaller,
  adjSession,
  crfCaller,
  crfSession,
  dcsCaller,
  dcsSession,
  enmCaller,
  enmSession,
} from "./helpers/test-caller";

describe("auditeur", () => {
  it("liste les auditeurs filtres par DCS", async () => {
    const user = await createUser({ id: dcsSession.user.id, role: "DCS" });
    const juridiction = await createJuridiction();
    const dcs = await createDcs({ userId: user.id, juridictionId: juridiction.id });
    const promotion = await createPromotion();
    const mds = await createMds({ juridictionId: juridiction.id });

    const auditeur1 = await createAuditeur({ nom: "Alpha", promotionId: promotion.id });
    const auditeur2 = await createAuditeur({ nom: "Beta", promotionId: promotion.id });

    await createStage({
      auditeurId: auditeur1.id,
      juridictionId: juridiction.id,
      dcsId: dcs.id,
      mdsId: mds.id,
    });
    await createStage({
      auditeurId: auditeur2.id,
      juridictionId: juridiction.id,
      dcsId: dcs.id,
      mdsId: mds.id,
      fonction: "INSTRUCTION",
      ordre: 2,
    });

    const result = await dcsCaller.auditeur.list({ dcsId: dcs.id });

    expect(result).toHaveLength(2);
    expect(result.map((a) => a.nom)).toContain("Alpha");
    expect(result.map((a) => a.nom)).toContain("Beta");
  });

  it("retourne le detail d'un auditeur avec ses stages", async () => {
    const user = await createUser({ id: dcsSession.user.id, role: "DCS" });
    const juridiction = await createJuridiction();
    const dcs = await createDcs({ userId: user.id, juridictionId: juridiction.id });
    const promotion = await createPromotion();
    const mds = await createMds({ juridictionId: juridiction.id });

    const auditeur = await createAuditeur({
      nom: "Dupont",
      prenom: "Marie",
      promotionId: promotion.id,
    });
    await createStage({
      auditeurId: auditeur.id,
      juridictionId: juridiction.id,
      dcsId: dcs.id,
      mdsId: mds.id,
    });

    const result = await dcsCaller.auditeur.byId({ id: auditeur.id });

    expect(result.nom).toBe("Dupont");
    expect(result.stages).toHaveLength(1);
    expect(result.stages[0].fonction).toBe("PARQUET");
  });
});

describe("auditeur.listForGestionnaire", () => {
  async function setupParisDcsScenario() {
    const dcsUser = await createUser({ id: dcsSession.user.id, role: "DCS" });
    const juridictionParis = await createJuridiction({ nom: "TGI Paris", region: "Ile-de-France" });
    const dcs = await createDcs({ userId: dcsUser.id, juridictionId: juridictionParis.id });
    const promotion = await createPromotion();
    const mds = await createMds({ juridictionId: juridictionParis.id });

    const adj = await createAuditeur({
      nom: "Alpha",
      prenom: "Antoine",
      promotionId: promotion.id,
    });
    const scp = await createAuditeur({
      nom: "Beta",
      prenom: "Bernard",
      type: "CONCOURS_PRO",
      promotionId: promotion.id,
    });

    const stageEnCours = await createStage({
      auditeurId: adj.id,
      juridictionId: juridictionParis.id,
      dcsId: dcs.id,
      mdsId: mds.id,
      fonction: "PARQUET",
    });
    await createStage({
      auditeurId: adj.id,
      juridictionId: juridictionParis.id,
      dcsId: dcs.id,
      mdsId: mds.id,
      fonction: "INSTRUCTION",
      ordre: 2,
    });
    await ctxUpdateStageStatut(stageEnCours.id, "EN_COURS");

    const stageScp = await createStage({
      auditeurId: scp.id,
      juridictionId: juridictionParis.id,
      dcsId: dcs.id,
      mdsId: mds.id,
      fonction: "PARQUET",
    });
    await createEvaluation({ stageId: stageScp.id, mdsId: mds.id, statut: "VALIDEE" });

    return { dcs, juridictionParis, promotion, mds, adj, scp };
  }

  it("retourne le périmètre DCS avec la juridiction du DCS connecté", async () => {
    const { juridictionParis } = await setupParisDcsScenario();

    const result = await dcsCaller.auditeur.listForGestionnaire({});

    expect(result.perimetre).toEqual({
      type: "DCS",
      juridiction: { id: juridictionParis.id, nom: "TGI Paris", ville: "Testville" },
    });
    expect(result.total).toBe(2);
    expect(result.items.map((i) => i.nom).sort()).toEqual(["Alpha", "Beta"]);
  });

  it("filtre par type ADJ vs CONCOURS_PRO", async () => {
    await setupParisDcsScenario();

    const adjOnly = await dcsCaller.auditeur.listForGestionnaire({ type: "ADJ" });
    expect(adjOnly.items).toHaveLength(1);
    expect(adjOnly.items[0].type).toBe("ADJ");

    const scpOnly = await dcsCaller.auditeur.listForGestionnaire({ type: "CONCOURS_PRO" });
    expect(scpOnly.items).toHaveLength(1);
    expect(scpOnly.items[0].type).toBe("CONCOURS_PRO");
  });

  it("recherche par nom et prénom (insensitive)", async () => {
    await setupParisDcsScenario();

    const byNom = await dcsCaller.auditeur.listForGestionnaire({ search: "alph" });
    expect(byNom.items).toHaveLength(1);
    expect(byNom.items[0].nom).toBe("Alpha");

    const byPrenom = await dcsCaller.auditeur.listForGestionnaire({ search: "BERNARD" });
    expect(byPrenom.items).toHaveLength(1);
    expect(byPrenom.items[0].prenom).toBe("Bernard");
  });

  it("filtre statut EN_COURS / EN_ATTENTE / TERMINE", async () => {
    const { adj, scp } = await setupParisDcsScenario();

    const enCours = await dcsCaller.auditeur.listForGestionnaire({ statut: "EN_COURS" });
    expect(enCours.items.map((i) => i.id)).toEqual([adj.id]);

    const termine = await dcsCaller.auditeur.listForGestionnaire({ statut: "TERMINE" });
    expect(termine.items.map((i) => i.id)).toEqual([]);

    const enAttente = await dcsCaller.auditeur.listForGestionnaire({ statut: "EN_ATTENTE" });
    expect(enAttente.items.map((i) => i.id)).toEqual([scp.id]);
  });

  it("trie par nom asc puis desc", async () => {
    await setupParisDcsScenario();

    const asc = await dcsCaller.auditeur.listForGestionnaire({ sort: "nom_asc" });
    expect(asc.items.map((i) => i.nom)).toEqual(["Alpha", "Beta"]);

    const desc = await dcsCaller.auditeur.listForGestionnaire({ sort: "nom_desc" });
    expect(desc.items.map((i) => i.nom)).toEqual(["Beta", "Alpha"]);
  });

  it("pagine correctement (total + pageCount)", async () => {
    const dcsUser = await createUser({ id: dcsSession.user.id, role: "DCS" });
    const juridiction = await createJuridiction();
    const dcs = await createDcs({ userId: dcsUser.id, juridictionId: juridiction.id });
    const promotion = await createPromotion();
    const mds = await createMds({ juridictionId: juridiction.id });

    for (let i = 0; i < 10; i++) {
      const auditeur = await createAuditeur({
        nom: `Nom${String(i).padStart(2, "0")}`,
        prenom: "Test",
        promotionId: promotion.id,
      });
      await createStage({
        auditeurId: auditeur.id,
        juridictionId: juridiction.id,
        dcsId: dcs.id,
        mdsId: mds.id,
      });
    }

    const page1 = await dcsCaller.auditeur.listForGestionnaire({ page: 1, pageSize: 4 });
    expect(page1.total).toBe(10);
    expect(page1.pageCount).toBe(3);
    expect(page1.items).toHaveLength(4);
    expect(page1.items[0].nom).toBe("Nom00");

    const page3 = await dcsCaller.auditeur.listForGestionnaire({ page: 3, pageSize: 4 });
    expect(page3.items).toHaveLength(2);
    expect(page3.items[0].nom).toBe("Nom08");
  });

  it("DCS ne voit pas les apprenants des autres DCS", async () => {
    const dcsUser = await createUser({ id: dcsSession.user.id, role: "DCS" });
    const juridictionA = await createJuridiction({ nom: "TGI A" });
    const dcsA = await createDcs({ userId: dcsUser.id, juridictionId: juridictionA.id });

    const otherUser = await createUser({ role: "DCS", email: "other@justice.fr" });
    const juridictionB = await createJuridiction({ nom: "TGI B" });
    const dcsB = await createDcs({ userId: otherUser.id, juridictionId: juridictionB.id });

    const promotion = await createPromotion();
    const mdsA = await createMds({ juridictionId: juridictionA.id });
    const mdsB = await createMds({ juridictionId: juridictionB.id });

    const auditeurA = await createAuditeur({ nom: "Mine", promotionId: promotion.id });
    const auditeurB = await createAuditeur({ nom: "Theirs", promotionId: promotion.id });
    await createStage({
      auditeurId: auditeurA.id,
      juridictionId: juridictionA.id,
      dcsId: dcsA.id,
      mdsId: mdsA.id,
    });
    await createStage({
      auditeurId: auditeurB.id,
      juridictionId: juridictionB.id,
      dcsId: dcsB.id,
      mdsId: mdsB.id,
    });

    const result = await dcsCaller.auditeur.listForGestionnaire({});
    expect(result.items.map((i) => i.nom)).toEqual(["Mine"]);
  });

  it("CRF voit tous les apprenants de sa région", async () => {
    const crfUser = await createUser({ id: crfSession.user.id, role: "CRF" });
    await createCrf({ userId: crfUser.id, region: "Ile-de-France" });

    const dcsUser = await createUser({ role: "DCS", email: "dcs-region@justice.fr" });
    const juridictionParis = await createJuridiction({ nom: "TGI Paris", region: "Ile-de-France" });
    const juridictionLyon = await createJuridiction({
      nom: "TJ Lyon",
      region: "Auvergne-Rhone-Alpes",
    });
    const dcs = await createDcs({ userId: dcsUser.id, juridictionId: juridictionParis.id });

    const otherDcsUser = await createUser({ role: "DCS", email: "dcs-lyon@justice.fr" });
    const dcsLyon = await createDcs({ userId: otherDcsUser.id, juridictionId: juridictionLyon.id });

    const promotion = await createPromotion();
    const mdsParis = await createMds({ juridictionId: juridictionParis.id });
    const mdsLyon = await createMds({ juridictionId: juridictionLyon.id });

    const apprenantParis = await createAuditeur({ nom: "Paris", promotionId: promotion.id });
    const apprenantLyon = await createAuditeur({ nom: "Lyon", promotionId: promotion.id });
    await createStage({
      auditeurId: apprenantParis.id,
      juridictionId: juridictionParis.id,
      dcsId: dcs.id,
      mdsId: mdsParis.id,
    });
    await createStage({
      auditeurId: apprenantLyon.id,
      juridictionId: juridictionLyon.id,
      dcsId: dcsLyon.id,
      mdsId: mdsLyon.id,
    });

    const result = await crfCaller.auditeur.listForGestionnaire({});

    expect(result.perimetre).toEqual({ type: "CRF", region: "Ile-de-France" });
    expect(result.items.map((i) => i.nom)).toEqual(["Paris"]);
  });

  it("ENM voit tous les apprenants (toutes juridictions)", async () => {
    await createUser({ id: enmSession.user.id, role: "ENM" });

    const dcsUser = await createUser({ role: "DCS", email: "dcs-enm@justice.fr" });
    const juridiction = await createJuridiction();
    const dcs = await createDcs({ userId: dcsUser.id, juridictionId: juridiction.id });
    const promotion = await createPromotion();
    const mds = await createMds({ juridictionId: juridiction.id });

    const auditeur = await createAuditeur({ nom: "Visible", promotionId: promotion.id });
    await createStage({
      auditeurId: auditeur.id,
      juridictionId: juridiction.id,
      dcsId: dcs.id,
      mdsId: mds.id,
    });

    const result = await enmCaller.auditeur.listForGestionnaire({});
    expect(result.perimetre).toEqual({ type: "ENM" });
    expect(result.items.map((i) => i.nom)).toEqual(["Visible"]);
  });

  it("ADJ reçoit FORBIDDEN", async () => {
    await createUser({ id: adjSession.user.id, role: "ADJ" });
    await expect(adjCaller.auditeur.listForGestionnaire({})).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
  });

  it("calcule les compteurs (stagesPlanifies, evaluationsCompletees, evaluationsEnAttente)", async () => {
    const dcsUser = await createUser({ id: dcsSession.user.id, role: "DCS" });
    const juridiction = await createJuridiction();
    const dcs = await createDcs({ userId: dcsUser.id, juridictionId: juridiction.id });
    const promotion = await createPromotion();
    const mds = await createMds({ juridictionId: juridiction.id });

    const auditeur = await createAuditeur({ nom: "Counts", promotionId: promotion.id });

    const stage1 = await createStage({
      auditeurId: auditeur.id,
      juridictionId: juridiction.id,
      dcsId: dcs.id,
      mdsId: mds.id,
      fonction: "PARQUET",
      ordre: 1,
    });
    const stage2 = await createStage({
      auditeurId: auditeur.id,
      juridictionId: juridiction.id,
      dcsId: dcs.id,
      mdsId: mds.id,
      fonction: "INSTRUCTION",
      ordre: 2,
    });
    await createStage({
      auditeurId: auditeur.id,
      juridictionId: juridiction.id,
      dcsId: dcs.id,
      mdsId: mds.id,
      fonction: "JAF",
      ordre: 3,
    });

    await createEvaluation({ stageId: stage1.id, mdsId: mds.id, statut: "VALIDEE" });
    await createEvaluation({ stageId: stage2.id, mdsId: mds.id, statut: "ATTENDUE" });

    const result = await dcsCaller.auditeur.listForGestionnaire({});

    expect(result.items).toHaveLength(1);
    expect(result.items[0].stagesPlanifies).toBe(3);
    expect(result.items[0].evaluationsCompletees).toBe(1);
    expect(result.items[0].evaluationsEnAttente).toBe(1);
  });
});

async function ctxUpdateStageStatut(
  id: string,
  statut: "EN_COURS" | "TERMINE" | "CLOTURE" | "PLANIFIE",
) {
  const { getTestDb } = await import("./helpers/test-db");
  await getTestDb().stage.update({ where: { id }, data: { statut } });
}
