import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { env } from "~/env";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";
import { withAxiom, type AxiomRequest } from "next-axiom";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a HTTP request (e.g. when you make requests from Client Components).
 */
const createContext = async (req: AxiomRequest) => {
  return createTRPCContext({
    headers: req.headers,
    log: req.log,
  });
};

const handler = withAxiom((req: AxiomRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext(req),
    onError:
      env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
            );
          }
        : undefined,
  }),
);

export { handler as GET, handler as POST };
