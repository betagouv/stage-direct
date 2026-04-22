/// <reference types="vite/client" />

import "@codegouvfr/react-dsfr/main.css";
import { Footer } from "@codegouvfr/react-dsfr/Footer";
import { Header } from "@codegouvfr/react-dsfr/Header";
import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { ReactNode } from "react";
import { authClient } from "~/lib/auth-client";
import { getSession } from "~/lib/auth-session";
import type { TrpcClient } from "~/router";
import { TRPCProvider } from "~/utils/trpc";

interface RootContext {
  queryClient: QueryClient;
  trpcClient: TrpcClient;
}

export const Route = createRootRouteWithContext<RootContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Stage Direct" },
    ],
  }),
  beforeLoad: async () => {
    const session = await getSession();
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
          <Header
            brandTop={
              <>
                REPUBLIQUE
                <br />
                FRANCAISE
              </>
            }
            homeLinkProps={{ href: "/", title: "Stage Direct" }}
            serviceTitle="Stage Direct"
            serviceTagline="Solution claire, outillee et partagee de gestion des stages"
            quickAccessItems={
              session?.user
                ? [
                    {
                      iconId: "ri-account-circle-line",
                      text: session.user.name || session.user.email,
                      buttonProps: { onClick: undefined },
                    },
                    {
                      iconId: "ri-logout-box-line",
                      text: "Se deconnecter",
                      buttonProps: {
                        onClick: () => {
                          authClient.signOut().then(() => {
                            window.location.href = "/login";
                          });
                        },
                      },
                    },
                  ]
                : [
                    {
                      iconId: "ri-login-box-line",
                      linkProps: { href: "/login" },
                      text: "Se connecter",
                    },
                  ]
            }
          />

          <Outlet />

          <Footer
            brandTop={
              <>
                REPUBLIQUE
                <br />
                FRANCAISE
              </>
            }
            accessibility="non compliant"
            homeLinkProps={{ href: "/", title: "Stage Direct" }}
          />

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
