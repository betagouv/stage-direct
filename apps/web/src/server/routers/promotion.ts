import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const promotionRouter = router({
  list: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.promotion.findMany({
      orderBy: { annee: "desc" },
      include: { _count: { select: { auditeurs: true } } },
    });
  }),

  byId: protectedProcedure.input(z.object({ id: z.string() })).query(({ ctx, input }) => {
    return ctx.prisma.promotion.findUniqueOrThrow({
      where: { id: input.id },
      include: {
        auditeurs: {
          orderBy: { nom: "asc" },
          select: { id: true, nom: true, prenom: true, email: true, type: true },
        },
      },
    });
  }),
});
