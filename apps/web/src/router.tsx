import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { createTRPCClient, httpBatchStreamLink, loggerLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import superjson from "superjson";
import { DefaultCatchBoundary } from "./components/default-catch-boundary";
import { routeTree } from "./routeTree.gen";
import type { AppRouter } from "./server/router";

export type TrpcClient = ReturnType<typeof createTRPCClient<AppRouter>>;

function getTrpcUrl() {
  if (typeof window !== "undefined") return "/api/trpc";
  const base = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";
  return `${base}/api/trpc`;
}

const getSsrHeaders = createServerFn({ method: "GET" }).handler(() =>
  Object.fromEntries(getRequestHeaders()),
);

export function getRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { staleTime: 5 * 1000 },
      dehydrate: { serializeData: superjson.serialize },
      hydrate: { deserializeData: superjson.deserialize },
    },
  });

  const trpcClient = createTRPCClient<AppRouter>({
    links: [
      loggerLink({
        enabled: (op) =>
          process.env.NODE_ENV === "development" ||
          (op.direction === "down" && op.result instanceof Error),
      }),
      httpBatchStreamLink({
        url: getTrpcUrl(),
        transformer: superjson,
        async headers() {
          if (typeof window !== "undefined") return {};
          return await getSsrHeaders();
        },
      }),
    ],
  });

  const trpc = createTRPCOptionsProxy<AppRouter>({ client: trpcClient, queryClient });

  const router = createRouter({
    routeTree,
    context: { queryClient, trpcClient, trpc },
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultErrorComponent: DefaultCatchBoundary,
  });

  setupRouterSsrQueryIntegration({ router, queryClient });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
