import { createFileRoute } from "@tanstack/react-router";
import { handleTRPCRequest } from "~/server/handler";

function handler({ request }: { request: Request }) {
  return handleTRPCRequest(request);
}

export const Route = createFileRoute("/api/trpc/$")({
  server: {
    handlers: {
      GET: handler,
      POST: handler,
    },
  },
});
