import { z } from "zod";
import { dcsProcedure, protectedProcedure, router } from "../trpc";

export const auditeurRouter = router({
  list: protectedProcedure
    .input(
      z
        .object({
          promotionId: z.string().optional(),
          juridictionId: z.string().optional(),
          dcsId: z.string().optional(),
        })
        .optional(),
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.auditeur.findMany({
        where: {
          promotionId: input?.promotionId,
          stages: {
            some: {
              juridictionId: input?.juridictionId,
              dcsId: input?.dcsId,
            },
          },
        },
        include: {
          promotion: true,
          _count: { select: { stages: true } },
        },
        orderBy: { nom: "asc" },
      });
    }),

  byId: protectedProcedure.input(z.object({ id: z.string() })).query(({ ctx, input }) => {
    return ctx.prisma.auditeur.findUniqueOrThrow({
      where: { id: input.id },
      include: {
        promotion: true,
        stages: {
          orderBy: { ordre: "asc" },
          include: {
            mds: { select: { nom: true, prenom: true, email: true } },
            evaluation: {
              select: { id: true, statut: true, dateEnvoi: true, dateReception: true },
            },
          },
        },
      },
    });
  }),

  create: dcsProcedure
    .input(
      z.object({
        nom: z.string().min(1),
        prenom: z.string().min(1),
        email: z.string().email(),
        type: z.enum(["ADJ", "CONCOURS_PRO"]),
        promotionId: z.string(),
        cvUrl: z.string().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.auditeur.create({ data: input });
    }),

  update: dcsProcedure
    .input(
      z.object({
        id: z.string(),
        nom: z.string().min(1).optional(),
        prenom: z.string().min(1).optional(),
        email: z.string().email().optional(),
        cvUrl: z.string().nullable().optional(),
      }),
    )
    .mutation(({ ctx, input: { id, ...data } }) => {
      return ctx.prisma.auditeur.update({ where: { id }, data });
    }),
});
