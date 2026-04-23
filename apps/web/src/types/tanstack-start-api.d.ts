declare module "@tanstack/react-start/api" {
  type Handler = (ctx: { request: Request }) => Response | Promise<Response>;
  export function createAPIFileRoute<TPath extends string>(
    path: TPath,
  ): (handlers: {
    GET?: Handler;
    POST?: Handler;
    PUT?: Handler;
    PATCH?: Handler;
    DELETE?: Handler;
  }) => unknown;
}
