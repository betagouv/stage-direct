import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { UserRole } from "~/generated/prisma/enums";
import { auth } from "./providers/better-auth";
import { prisma } from "./providers/prisma";

export const createTRPCContext = async ({ headers }: { headers: Headers }) => {
  const session = await auth.api.getSession({ headers });
  return { prisma, session };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
});

const isAuthenticated = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: { session: { ...ctx.session, user: ctx.session.user } },
  });
});

const hasRole = (...roles: UserRole[]) =>
  t.middleware(async ({ ctx, next }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      select: { id: true, role: true },
    });
    if (!user?.role || !roles.includes(user.role)) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Acces non autorise" });
    }
    return next({
      ctx: { session: { ...ctx.session, user: ctx.session.user }, role: user.role },
    });
  });

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthenticated);
export const dcsProcedure = t.procedure.use(hasRole("DCS"));
export const crfProcedure = t.procedure.use(hasRole("CRF"));
export const adminProcedure = t.procedure.use(hasRole("ADMIN"));
export const enmProcedure = t.procedure.use(hasRole("ENM"));
export const gestionnaireProcedure = t.procedure.use(hasRole("DCS", "CRF", "ENM"));
