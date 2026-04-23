/// <reference types="vite/client" />

import "@codegouvfr/react-dsfr/main.css";
import "~/globals.css";
import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  redirect,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { ReactNode } from "react";
import { Footer } from "~/components/footer";
import { Header } from "~/components/header";
import { Toaster } from "~/components/ui/toaster";
import { getSession } from "~/lib/auth-session";
import type { TrpcClient } from "~/router";
import { TRPCProvider, type TrpcOptionsProxy } from "~/utils/trpc";

interface RootContext {
  queryClient: QueryClient;
  trpcClient: TrpcClient;
  trpc: TrpcOptionsProxy;
}

export const Route = createRootRouteWithContext<RootContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Stage Direct" },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const session = await getSession();
    if (
      session?.user &&
      !session.user.role &&
      location.pathname !== "/onboarding" &&
      location.pathname !== "/se-connecter"
    ) {
      throw redirect({ to: "/onboarding" });
    }
    return { session };
  },
  component: RootComponent,
});

function RootComponent() {
  const { queryClient, trpcClient, session } = Route.useRouteContext();

  return (
    <RootDocument>
      <QueryClientProvider client={queryClient}>
        <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
          <Header user={session?.user} />
          <Outlet />
          <Footer />
          <Toaster />
          <TanStackRouterDevtools position="bottom-right" />
          <ReactQueryDevtools buttonPosition="bottom-left" />
        </TRPCProvider>
      </QueryClientProvider>
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="fr" data-fr-scheme="system">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
