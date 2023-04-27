import { initTRPC, inferAsyncReturnType } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";

const t = initTRPC.create();

export const createContext = async ({
	req,
	res,
}: trpcExpress.CreateExpressContextOptions) => {
	//@ts-ignore
	const session = req.session;

	return {
		session: session,
	};
}; // no context
type Context = inferAsyncReturnType<typeof createContext>;

export const middleware = t.middleware;
export const router = t.router;
export const publicProcedure = t.procedure;
