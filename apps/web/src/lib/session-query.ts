import { queryOptions } from "@tanstack/react-query";
import { getSession } from "~/lib/auth-session";

export const sessionQueryKey = ["auth", "session"] as const;

export type Session = Awaited<ReturnType<typeof getSession>>;

export function getSessionQueryOptions() {
  return queryOptions({
    queryKey: sessionQueryKey,
    queryFn: () => getSession(),
    staleTime: 60 * 1000,
  });
}
