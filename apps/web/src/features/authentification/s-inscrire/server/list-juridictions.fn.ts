import { createServerFn } from "@tanstack/react-start";
import { prisma } from "~/server/providers";

export const listJuridictions = createServerFn({ method: "GET" }).handler(async () => {
  return prisma.juridiction.findMany({
    select: { id: true, nom: true, region: true },
    orderBy: { nom: "asc" },
  });
});

export const listRegions = createServerFn({ method: "GET" }).handler(async () => {
  const rows = await prisma.juridiction.findMany({
    select: { region: true },
    distinct: ["region"],
    orderBy: { region: "asc" },
  });
  return rows.map((r) => r.region);
});
