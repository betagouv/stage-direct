import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";

const ZSetUserRoleAndProfile = z.discriminatedUnion("role", [
  z.object({
    role: z.literal("DCS"),
    juridictionId: z.string().min(1),
    nom: z.string().min(1),
    prenom: z.string().min(1),
  }),
  z.object({
    role: z.literal("MDS"),
    juridictionId: z.string().min(1),
    nom: z.string().min(1),
    prenom: z.string().min(1),
  }),
  z.object({
    role: z.literal("CRF"),
    region: z.string().min(1),
    nom: z.string().min(1),
    prenom: z.string().min(1),
  }),
]);

export const authentificationRouter = router({
  listJuridictions: publicProcedure.query(({ ctx }) =>
    ctx.prisma.juridiction.findMany({
      select: { id: true, nom: true, region: true },
      orderBy: { nom: "asc" },
    }),
  ),

  listRegions: publicProcedure.query(async ({ ctx }) => {
    const rows = await ctx.prisma.juridiction.findMany({
      select: { region: true },
      distinct: ["region"],
      orderBy: { region: "asc" },
    });
    return rows.map((r) => r.region);
  }),

  setUserRoleAndProfile: protectedProcedure
    .input(ZSetUserRoleAndProfile)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user.id;
      if (!userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      await ctx.prisma.user.update({
        where: { id: userId },
        data: {
          role: input.role,
          nom: input.nom,
          prenom: input.prenom,
          name: `${input.prenom} ${input.nom}`.trim(),
        },
      });

      if (input.role === "DCS") {
        await ctx.prisma.dcs.upsert({
          where: { userId },
          create: { userId, juridictionId: input.juridictionId },
          update: { juridictionId: input.juridictionId },
        });
      } else if (input.role === "MDS") {
        await ctx.prisma.mds.upsert({
          where: { userId },
          create: {
            userId,
            juridictionId: input.juridictionId,
          },
          update: {
            juridictionId: input.juridictionId,
          },
        });
      } else {
        await ctx.prisma.crf.upsert({
          where: { userId },
          create: { userId, region: input.region },
          update: { region: input.region },
        });
      }

      return { success: true };
    }),
});
