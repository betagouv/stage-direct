import { createMiddleware, createStart } from "@tanstack/react-start";
import { setResponseHeader } from "@tanstack/react-start/server";

const noIndexMiddleware = createMiddleware().server(async ({ next }) => {
  setResponseHeader("X-Robots-Tag", "noindex, nofollow");
  return next();
});

export const startInstance = createStart(() => ({
  requestMiddleware: [noIndexMiddleware],
}));
