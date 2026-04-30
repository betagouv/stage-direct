import { redirect } from "@tanstack/react-router";
import type { Session } from "~/lib/session-query";

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
