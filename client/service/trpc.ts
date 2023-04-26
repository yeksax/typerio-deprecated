import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../../server/routes/_app";

export const clientTRPC = createTRPCProxyClient<AppRouter>({
	links: [
		httpBatchLink({
			url: "http://localhost:3001/trpc",
			// You can pass any HTTP headers you wish here
		}),
	],
});
