import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { getUserGroups } from "../util/userGetGroups";
import { createUser } from "../util/userCreate";
import { getUser } from "../util/userGet";

export const userRouter = router({
	get: publicProcedure.input(z.string()).query(async (req) => {
		let user = await getUser(req.input);
		return user;
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
	getGroups: publicProcedure.input(z.string()).query(async (req) => {
		let groups = await getUserGroups(req.input);
		return groups;
	}),
});
