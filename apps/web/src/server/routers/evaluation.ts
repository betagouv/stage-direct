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
    .query(({ ctx, input }) => {
      return ctx.prisma.evaluation.findMany({
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
              auditeur: { select: { nom: true, prenom: true } },
            },
          },
          mds: { select: { nom: true, prenom: true, email: true } },
          _count: { select: { relances: true } },
        },
        orderBy: { dateLimite: "asc" },
      });
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
