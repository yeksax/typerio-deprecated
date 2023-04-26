import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { getUserGroups } from "../util/userGetGroups";
import { createUser } from "../util/userCreate";

export const userRouter = router({
	getGroups: publicProcedure.input(z.string()).query(async (req) => {
		let groups = await getUserGroups(req.input);
		return groups;
	}),
	create: publicProcedure
		.input(
			z.object({
				name: z.string(),
				email: z.string(),
			})
		)
		.mutation(async (req) => {
			const user = createUser(req.input);
			return user;
		}),
});
