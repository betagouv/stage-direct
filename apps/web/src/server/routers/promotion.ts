import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const promotionRouter = router({
  list: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.promotion.findMany({
      orderBy: { annee: "desc" },
      include: { _count: { select: { auditeurs: true } } },
    });
  }),

  byId: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const promotion = await ctx.prisma.promotion.findUniqueOrThrow({
      where: { id: input.id },
      include: {
        auditeurs: {
          orderBy: { user: { nom: "asc" } },
          include: { user: { select: { nom: true, prenom: true, email: true, telephone: true } } },
        },
      },
    });

    return {
      ...promotion,
      auditeurs: promotion.auditeurs.map(({ user, ...auditeur }) => ({
        ...auditeur,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        telephone: user.telephone,
      })),
    };
  }),
});
