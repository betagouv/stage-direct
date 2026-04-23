import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { z } from "zod";
import { auth, prisma } from "~/server/providers";

export const ZSetUserRoleAndProfile = z.discriminatedUnion("role", [
  z.object({
    role: z.literal("DCS"),
    juridictionId: z.string().min(1),
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
  }),
]);

export type TSetUserRoleAndProfile = z.infer<typeof ZSetUserRoleAndProfile>;

export const setUserRoleAndProfile = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ZSetUserRoleAndProfile.parse(input))
  .handler(async ({ data }) => {
    const session = await auth.api.getSession({ headers: getRequestHeaders() });
    if (!session?.user) {
      throw new Error("UNAUTHORIZED");
    }
    const userId = session.user.id;
    const email = session.user.email;

    await prisma.user.update({ where: { id: userId }, data: { role: data.role } });

    if (data.role === "DCS") {
      await prisma.dcs.upsert({
        where: { userId },
        create: { userId, juridictionId: data.juridictionId },
        update: { juridictionId: data.juridictionId },
      });
    } else if (data.role === "MDS") {
      await prisma.mds.upsert({
        where: { userId },
        create: {
          userId,
          juridictionId: data.juridictionId,
          nom: data.nom,
          prenom: data.prenom,
          email,
        },
        update: {
          juridictionId: data.juridictionId,
          nom: data.nom,
          prenom: data.prenom,
        },
      });
    } else if (data.role === "CRF") {
      await prisma.crf.upsert({
        where: { userId },
        create: { userId, region: data.region },
        update: { region: data.region },
      });
    }

    return { success: true };
  });
