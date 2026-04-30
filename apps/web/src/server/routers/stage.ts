import { z } from "zod";
import { dcsProcedure, protectedProcedure, router } from "../trpc";

export const stageRouter = router({
  listByDcs: protectedProcedure
    .input(z.object({ dcsId: z.string() }))
    .query(async ({ ctx, input }) => {
      const stages = await ctx.prisma.stage.findMany({
        where: { dcsId: input.dcsId },
        include: {
          auditeur: { include: { user: { select: { nom: true, prenom: true, email: true } } } },
          mds: { include: { user: { select: { nom: true, prenom: true } } } },
          evaluation: { select: { id: true, statut: true } },
        },
        orderBy: [{ auditeurId: "asc" }, { ordre: "asc" }],
      });

      return stages.map(({ auditeur, mds, ...stage }) => ({
        ...stage,
        auditeur: {
          ...auditeur,
          nom: auditeur.user.nom,
          prenom: auditeur.user.prenom,
          email: auditeur.user.email,
        },
        mds: mds
          ? {
              ...mds,
              nom: mds.user.nom,
              prenom: mds.user.prenom,
            }
          : null,
      }));
    }),

  listByAuditeur: protectedProcedure
    .input(z.object({ auditeurId: z.string() }))
    .query(async ({ ctx, input }) => {
      const stages = await ctx.prisma.stage.findMany({
        where: { auditeurId: input.auditeurId },
        include: {
          mds: { include: { user: { select: { nom: true, prenom: true, email: true } } } },
          evaluation: true,
          juridiction: { select: { nom: true, ville: true } },
        },
        orderBy: { ordre: "asc" },
      });

      return stages.map(({ mds, ...stage }) => ({
        ...stage,
        mds: mds
          ? {
              ...mds,
              nom: mds.user.nom,
              prenom: mds.user.prenom,
              email: mds.user.email,
            }
          : null,
      }));
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
