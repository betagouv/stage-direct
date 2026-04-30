import { z } from "zod";
import { dcsProcedure, protectedProcedure, router } from "../trpc";

export const evaluationRouter = router({
  listByDcs: protectedProcedure
    .input(
      z.object({
        dcsId: z.string(),
        statut: z
          .enum(["ATTENDUE", "ENVOYEE", "EN_COURS", "SOUMISE", "VALIDEE", "EN_RETARD"])
          .optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const evaluations = await ctx.prisma.evaluation.findMany({
        where: {
          stage: { dcsId: input.dcsId },
          statut: input.statut,
        },
        include: {
          stage: {
            select: {
              fonction: true,
              dateDebut: true,
              dateFin: true,
              auditeur: { include: { user: { select: { nom: true, prenom: true } } } },
            },
          },
          mds: { include: { user: { select: { nom: true, prenom: true, email: true } } } },
          _count: { select: { relances: true } },
        },
        orderBy: { dateLimite: "asc" },
      });

      return evaluations.map(({ stage, mds, ...evaluation }) => ({
        ...evaluation,
        stage: {
          ...stage,
          auditeur: {
            ...stage.auditeur,
            nom: stage.auditeur.user.nom,
            prenom: stage.auditeur.user.prenom,
          },
        },
        mds: {
          ...mds,
          nom: mds.user.nom,
          prenom: mds.user.prenom,
          email: mds.user.email,
        },
      }));
    }),

  updateStatut: dcsProcedure
    .input(
      z.object({
        id: z.string(),
        statut: z.enum(["ATTENDUE", "ENVOYEE", "EN_COURS", "SOUMISE", "VALIDEE", "EN_RETARD"]),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.evaluation.update({
        where: { id: input.id },
        data: {
          statut: input.statut,
          dateReception: input.statut === "VALIDEE" ? new Date() : undefined,
        },
      });
    }),
});
