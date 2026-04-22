import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const alerteRouter = router({
  list: protectedProcedure
    .input(z.object({ dcsId: z.string(), nonLuesSeulement: z.boolean().default(false) }))
    .query(({ ctx, input }) => {
      return ctx.prisma.alerte.findMany({
        where: {
          dcsId: input.dcsId,
          lue: input.nonLuesSeulement ? false : undefined,
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      });
    }),

  marquerLue: protectedProcedure.input(z.object({ id: z.string() })).mutation(({ ctx, input }) => {
    return ctx.prisma.alerte.update({
      where: { id: input.id },
      data: { lue: true },
    });
  }),

  marquerToutesLues: protectedProcedure
    .input(z.object({ dcsId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.alerte.updateMany({
        where: { dcsId: input.dcsId, lue: false },
        data: { lue: true },
      });
    }),
});
