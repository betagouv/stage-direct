import { redirect } from "@tanstack/react-router";

type Session = { user: { role?: string | null } | null } | null;

type BeforeLoadCtx = {
  context: { session: Session };
  location: { pathname: string };
};

export function redirectIfAuthenticated({ context: { session } }: BeforeLoadCtx) {
  if (session?.user) {
    throw redirect({ to: "/" });
  }
}

export function redirectIfGuest({ context: { session } }: BeforeLoadCtx) {
  if (!session?.user) {
    throw redirect({ to: "/se-connecter" });
  }
}

export function redirectIfProfileComplete({ context: { session } }: BeforeLoadCtx) {
  if (!session?.user) {
    throw redirect({ to: "/se-connecter" });
  }
  if (session.user.role) {
    throw redirect({ to: "/" });
  }
}
