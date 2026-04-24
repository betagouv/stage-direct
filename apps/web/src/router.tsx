import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import superjson from "superjson";
import { routeTree } from "./routeTree.gen";
import type { AppRouter } from "./server/router";

export type TrpcClient = ReturnType<typeof createTRPCClient<AppRouter>>;

function getTrpcUrl() {
  if (typeof window !== "undefined") return "/api/trpc";
  const base = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";
  return `${base}/api/trpc`;
}

export function getRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { staleTime: 5 * 1000 },
    },
  });

  const trpcClient = createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: getTrpcUrl(),
        transformer: superjson,
      }),
    ],
  });

  const trpc = createTRPCOptionsProxy<AppRouter>({ client: trpcClient, queryClient });

  const router = createRouter({
    routeTree,
    context: { queryClient, trpcClient, trpc },
    scrollRestoration: true,
    defaultPreload: "intent",
  });

  setupRouterSsrQueryIntegration({ router, queryClient });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
