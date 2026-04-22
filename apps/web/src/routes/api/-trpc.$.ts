import { createAPIFileRoute } from "@tanstack/react-start/api";
import { handleTRPCRequest } from "../../server/handler";

export const APIRoute = createAPIFileRoute("/api/trpc/$")({
  GET: ({ request }) => handleTRPCRequest(request),
  POST: ({ request }) => handleTRPCRequest(request),
});
