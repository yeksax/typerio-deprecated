import { router } from "../trpc";
import { z } from "zod";

import { groupRouter } from "./group";
import { userRouter } from "./user";

export const appRouter = router({
	groups: groupRouter,
	user: userRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
