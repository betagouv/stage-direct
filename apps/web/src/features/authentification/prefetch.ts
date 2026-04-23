import type { QueryClient } from "@tanstack/react-query";
import type { TrpcOptionsProxy } from "~/utils/trpc";

/**
 * Prefetches the queries needed by the sign-up and onboarding forms
 * (juridictions list for DCS/MDS, regions list for CRF).
 */
export const prefetchAuthentificationQueries = (queryClient: QueryClient, trpc: TrpcOptionsProxy) =>
  Promise.all([
    queryClient.ensureQueryData(trpc.authentification.listJuridictions.queryOptions()),
    queryClient.ensureQueryData(trpc.authentification.listRegions.queryOptions()),
  ]);
