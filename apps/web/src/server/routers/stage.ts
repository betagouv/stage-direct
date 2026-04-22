import { z } from "zod";
import { dcsProcedure, protectedProcedure, router } from "../trpc";

export const stageRouter = router({
  listByDcs: protectedProcedure.input(z.object({ dcsId: z.string() })).query(({ ctx, input }) => {
    return ctx.prisma.stage.findMany({
      where: { dcsId: input.dcsId },
      include: {
        auditeur: { select: { nom: true, prenom: true, email: true, type: true } },
        mds: { select: { nom: true, prenom: true } },
        evaluation: { select: { id: true, statut: true } },
      },
      orderBy: [{ auditeurId: "asc" }, { ordre: "asc" }],
    });
  }),

  listByAuditeur: protectedProcedure
    .input(z.object({ auditeurId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.stage.findMany({
        where: { auditeurId: input.auditeurId },
        include: {
          mds: { select: { nom: true, prenom: true, email: true } },
          evaluation: true,
          juridiction: { select: { nom: true, ville: true } },
        },
        orderBy: { ordre: "asc" },
      });
    }),

  updateStatut: dcsProcedure
    .input(
      z.object({
        id: z.string(),
        statut: z.enum(["PLANIFIE", "EN_COURS", "TERMINE", "CLOTURE"]),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.stage.update({
        where: { id: input.id },
        data: { statut: input.statut },
      });
    }),

  update: dcsProcedure
    .input(
      z.object({
        id: z.string(),
        dateDebut: z.date().optional(),
        dateFin: z.date().optional(),
        mdsId: z.string().nullable().optional(),
      }),
    )
    .mutation(({ ctx, input: { id, ...data } }) => {
      return ctx.prisma.stage.update({ where: { id }, data });
    }),
});
