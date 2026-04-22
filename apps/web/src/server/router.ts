import { z } from "zod";
import { alerteRouter } from "./routers/alerte";
import { auditeurRouter } from "./routers/auditeur";
import { dashboardRouter } from "./routers/dashboard";
import { evaluationRouter } from "./routers/evaluation";
import { juridictionRouter } from "./routers/juridiction";
import { promotionRouter } from "./routers/promotion";
import { stageRouter } from "./routers/stage";
import { protectedProcedure, router } from "./trpc";

export const appRouter = router({
  user: router({
    list: protectedProcedure.query(({ ctx }) => {
      return ctx.prisma.user.findMany({ orderBy: { createdAt: "desc" } });
    }),
    byId: protectedProcedure.input(z.object({ id: z.string() })).query(({ ctx, input }) => {
      return ctx.prisma.user.findUnique({ where: { id: input.id } });
    }),
  }),
  juridiction: juridictionRouter,
  promotion: promotionRouter,
  auditeur: auditeurRouter,
  stage: stageRouter,
  evaluation: evaluationRouter,
  alerte: alerteRouter,
  dashboard: dashboardRouter,
});

export type AppRouter = typeof appRouter;
