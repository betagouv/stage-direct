import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const juridictionRouter = router({
  list: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.juridiction.findMany({
      orderBy: { nom: "asc" },
      include: { _count: { select: { dcs: true, stages: true } } },
    });
  }),

  byId: protectedProcedure.input(z.object({ id: z.string() })).query(({ ctx, input }) => {
    return ctx.prisma.juridiction.findUniqueOrThrow({
      where: { id: input.id },
      include: {
        dcs: { include: { user: { select: { name: true, email: true } } } },
        mds: true,
      },
    });
  }),
});
