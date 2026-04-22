import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const dashboardRouter = router({
  stats: protectedProcedure.input(z.object({ dcsId: z.string() })).query(async ({ ctx, input }) => {
    const [auditeurs, stagesEnCours, evaluationsEnRetard, evaluationsAttendues, alertesNonLues] =
      await Promise.all([
        ctx.prisma.auditeur.count({
          where: { stages: { some: { dcsId: input.dcsId } } },
        }),
        ctx.prisma.stage.count({
          where: { dcsId: input.dcsId, statut: "EN_COURS" },
        }),
        ctx.prisma.evaluation.count({
          where: { stage: { dcsId: input.dcsId }, statut: "EN_RETARD" },
        }),
        ctx.prisma.evaluation.count({
          where: {
            stage: { dcsId: input.dcsId },
            statut: { in: ["ATTENDUE", "ENVOYEE"] },
          },
        }),
        ctx.prisma.alerte.count({
          where: { dcsId: input.dcsId, lue: false },
        }),
      ]);

    return {
      auditeurs,
      stagesEnCours,
      evaluationsEnRetard,
      evaluationsAttendues,
      alertesNonLues,
    };
  }),
});
