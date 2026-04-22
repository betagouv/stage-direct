import { describe, expect, it } from "vitest";
import {
  createAuditeur,
  createDcs,
  createEvaluation,
  createJuridiction,
  createMds,
  createPromotion,
  createStage,
  createUser,
} from "./fixtures/factories";
import "./helpers/setup-integration";
import { dcsCaller, dcsSession } from "./helpers/test-caller";

describe("dashboard.stats", () => {
  it("retourne les compteurs du DCS", async () => {
    const user = await createUser({ id: dcsSession.user.id, role: "DCS" });
    const juridiction = await createJuridiction();
    const dcs = await createDcs({ userId: user.id, juridictionId: juridiction.id });
    const promotion = await createPromotion();
    const mds = await createMds({ juridictionId: juridiction.id });

    const auditeur = await createAuditeur({ promotionId: promotion.id });
    const stage1 = await createStage({
      auditeurId: auditeur.id,
      juridictionId: juridiction.id,
      dcsId: dcs.id,
      mdsId: mds.id,
    });

    await createEvaluation({ stageId: stage1.id, mdsId: mds.id, statut: "EN_RETARD" });

    const stats = await dcsCaller.dashboard.stats({ dcsId: dcs.id });

    expect(stats.auditeurs).toBe(1);
    expect(stats.evaluationsEnRetard).toBe(1);
  });

  it("retourne 0 quand le DCS n'a pas de stagiaires", async () => {
    const user = await createUser({ id: dcsSession.user.id, role: "DCS" });
    const juridiction = await createJuridiction();
    const dcs = await createDcs({ userId: user.id, juridictionId: juridiction.id });

    const stats = await dcsCaller.dashboard.stats({ dcsId: dcs.id });

    expect(stats.auditeurs).toBe(0);
    expect(stats.stagesEnCours).toBe(0);
    expect(stats.evaluationsEnRetard).toBe(0);
    expect(stats.evaluationsAttendues).toBe(0);
    expect(stats.alertesNonLues).toBe(0);
  });
});
