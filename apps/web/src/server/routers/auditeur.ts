import { TRPCError } from "@trpc/server";
import { z } from "zod";
import type { Prisma, PrismaClient } from "~/generated/prisma/client";
import { dcsProcedure, gestionnaireProcedure, protectedProcedure, router } from "../trpc";

const TYPE_FILTER = z.enum(["ALL", "ADJ", "CONCOURS_PRO"]);
const STATUT_FILTER = z.enum(["ALL", "EN_COURS", "EN_ATTENTE", "TERMINE"]);
const SORT = z.enum(["nom_asc", "nom_desc"]);

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

  listForGestionnaire: gestionnaireProcedure
    .input(
      z.object({
        type: TYPE_FILTER.default("ALL"),
        statut: STATUT_FILTER.default("ALL"),
        search: z.string().trim().min(1).max(100).optional(),
        sort: SORT.default("nom_asc"),
        page: z.number().int().min(1).default(1),
        pageSize: z.number().int().min(1).max(50).default(8),
      }),
    )
    .query(async ({ ctx, input }) => {
      const role = ctx.role as Role;
      const userId = ctx.session.user.id;

      const { stagesScope, perimetre } = await resolveScope(ctx.prisma, role, userId);

      const where: Prisma.AuditeurWhereInput = {
        ...(input.type !== "ALL" && { type: input.type }),
        ...(input.search && {
          user: {
            OR: [
              { nom: { contains: input.search, mode: "insensitive" } },
              { prenom: { contains: input.search, mode: "insensitive" } },
            ],
          },
        }),
        stages: { some: stagesScope },
      };

      if (input.statut === "EN_COURS") {
        where.AND = [{ stages: { some: { ...stagesScope, statut: "EN_COURS" } } }];
      } else if (input.statut === "EN_ATTENTE") {
        where.AND = [
          { stages: { none: { ...stagesScope, statut: "EN_COURS" } } },
          { stages: { some: { ...stagesScope, statut: "PLANIFIE" } } },
        ];
      } else if (input.statut === "TERMINE") {
        where.AND = [
          {
            stages: {
              none: { ...stagesScope, statut: { in: ["EN_COURS", "PLANIFIE"] } },
            },
          },
        ];
      }

      const skip = (input.page - 1) * input.pageSize;

      const [total, auditeurs] = await Promise.all([
        ctx.prisma.auditeur.count({ where }),
        ctx.prisma.auditeur.findMany({
          where,
          orderBy: { user: { nom: input.sort === "nom_asc" ? "asc" : "desc" } },
          skip,
          take: input.pageSize,
          include: {
            user: { select: { nom: true, prenom: true } },
            stages: {
              where: stagesScope,
              select: {
                fonction: true,
                statut: true,
                evaluation: { select: { statut: true } },
              },
            },
          },
        }),
      ]);

      const items = auditeurs.map(({ user, stages, ...auditeur }) => {
        const stagesPlanifies = stages.filter((s) => s.statut === "PLANIFIE").length;
        const evaluationsCompletees = stages.filter(
          (s) =>
            s.evaluation &&
            (s.evaluation.statut === "SOUMISE" || s.evaluation.statut === "VALIDEE"),
        ).length;
        const evaluationsEnAttente = stages.filter(
          (s) =>
            s.evaluation &&
            (s.evaluation.statut === "ATTENDUE" ||
              s.evaluation.statut === "ENVOYEE" ||
              s.evaluation.statut === "EN_COURS" ||
              s.evaluation.statut === "EN_RETARD"),
        ).length;

        let statutGlobal: "EN_COURS" | "EN_ATTENTE" | "TERMINE";
        if (stages.some((s) => s.statut === "EN_COURS")) {
          statutGlobal = "EN_COURS";
        } else if (stages.every((s) => s.statut === "TERMINE" || s.statut === "CLOTURE")) {
          statutGlobal = "TERMINE";
        } else {
          statutGlobal = "EN_ATTENTE";
        }

        const fonctions = stages.map((s) => ({ fonction: s.fonction, statut: s.statut }));

        return {
          id: auditeur.id,
          type: auditeur.type,
          nom: user.nom,
          prenom: user.prenom,
          statutGlobal,
          stagesPlanifies,
          evaluationsCompletees,
          evaluationsEnAttente,
          fonctions,
        };
      });

      return {
        items,
        total,
        page: input.page,
        pageSize: input.pageSize,
        pageCount: Math.max(1, Math.ceil(total / input.pageSize)),
        perimetre,
      };
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

type Role = "DCS" | "CRF" | "ENM";

type Perimetre =
  | { type: "DCS"; juridiction: { id: string; nom: string; ville: string } }
  | { type: "CRF"; region: string }
  | { type: "ENM" };

async function resolveScope(
  prisma: PrismaClient,
  role: Role,
  userId: string,
): Promise<{ stagesScope: Prisma.StageWhereInput; perimetre: Perimetre }> {
  if (role === "DCS") {
    const dcs = await prisma.dcs.findUnique({
      where: { userId },
      include: { juridiction: { select: { id: true, nom: true, ville: true } } },
    });
    if (!dcs) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Profil DCS introuvable" });
    }
    return {
      stagesScope: { dcsId: dcs.id },
      perimetre: { type: "DCS", juridiction: dcs.juridiction },
    };
  }
  if (role === "CRF") {
    const crf = await prisma.crf.findUnique({ where: { userId } });
    if (!crf) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Profil CRF introuvable" });
    }
    return {
      stagesScope: { juridiction: { region: crf.region } },
      perimetre: { type: "CRF", region: crf.region },
    };
  }
  return { stagesScope: {}, perimetre: { type: "ENM" } };
}
