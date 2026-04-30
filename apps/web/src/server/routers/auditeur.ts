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
    .query(async ({ ctx, input }) => {
      const auditeurs = await ctx.prisma.auditeur.findMany({
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
          user: { select: { nom: true, prenom: true, email: true, telephone: true } },
          _count: { select: { stages: true } },
        },
        orderBy: { user: { nom: "asc" } },
      });

      return auditeurs.map(({ user, ...auditeur }) => ({
        ...auditeur,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        telephone: user.telephone,
      }));
    }),

  byId: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const auditeur = await ctx.prisma.auditeur.findUniqueOrThrow({
      where: { id: input.id },
      include: {
        promotion: true,
        user: { select: { nom: true, prenom: true, email: true, telephone: true } },
        stages: {
          orderBy: { ordre: "asc" },
          include: {
            mds: {
              include: {
                user: { select: { nom: true, prenom: true, email: true, telephone: true } },
              },
            },
            evaluation: {
              select: { id: true, statut: true, dateEnvoi: true, dateReception: true },
            },
          },
        },
      },
    });

    return {
      ...auditeur,
      nom: auditeur.user.nom,
      prenom: auditeur.user.prenom,
      email: auditeur.user.email,
      telephone: auditeur.user.telephone,
      stages: auditeur.stages.map(({ mds, ...stage }) => ({
        ...stage,
        mds: mds
          ? {
              ...mds,
              nom: mds.user.nom,
              prenom: mds.user.prenom,
              email: mds.user.email,
              telephone: mds.user.telephone,
            }
          : null,
      })),
    };
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
      const { nom, prenom, email, promotionId, type, cvUrl } = input;
      return ctx.prisma.auditeur.create({
        data: {
          type,
          cvUrl,
          promotion: { connect: { id: promotionId } },
          user: {
            create: {
              email,
              nom,
              prenom,
              name: `${prenom} ${nom}`.trim(),
              role: "ADJ",
              emailVerified: true,
            },
          },
        },
      });
    }),

  update: dcsProcedure
    .input(
      z.object({
        id: z.string(),
        nom: z.string().min(1).optional(),
        prenom: z.string().min(1).optional(),
        email: z.string().email().optional(),
        telephone: z.string().optional(),
        cvUrl: z.string().nullable().optional(),
      }),
    )
    .mutation(async ({ ctx, input: { id, nom, prenom, email, telephone, cvUrl } }) => {
      const auditeur = await ctx.prisma.auditeur.findUniqueOrThrow({
        where: { id },
        include: { user: true },
      });

      return ctx.prisma.auditeur.update({
        where: { id },
        data: {
          cvUrl,
          user: {
            update: {
              ...(nom ? { nom } : {}),
              ...(prenom ? { prenom } : {}),
              ...(email ? { email } : {}),
              ...(telephone !== undefined ? { telephone } : {}),
              name: `${prenom ?? auditeur.user.prenom ?? ""} ${nom ?? auditeur.user.nom ?? ""}`.trim(),
            },
          },
        },
      });
    }),
});
