import { describe, expect, it } from "vitest";
import {
  createAuditeur,
  createDcs,
  createJuridiction,
  createMds,
  createPromotion,
  createStage,
  createUser,
} from "./fixtures/factories";
import "./helpers/setup-integration";
import { dcsCaller, dcsSession } from "./helpers/test-caller";

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
