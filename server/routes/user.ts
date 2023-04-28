import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { getUserGroups } from "../util/userGetGroups";
import { createUser } from "../util/userCreate";
import { updateUser, updateUserAvatar } from "../util/userUpdate";
import {
	getProfile,
	getProfileByEmail,
	getUser,
	getUserByEmail,
} from "../util/userGet";

export const userRouter = router({
	get: publicProcedure.input(z.string()).query(async (req) => {
		let user = await getUser(req.input);
		return user;
	}),

	getByEmail: publicProcedure.input(z.string()).query(async (req) => {
		let user = await getUserByEmail(req.input);
		return user;
	}),

	getProfile: publicProcedure.input(z.string()).query(async (req) => {
		let user = await getProfile(req.input);
		return user;
	}),

	getProfileByEmail: publicProcedure.input(z.string()).query(async (req) => {
		let user = await getProfileByEmail(req.input);
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

	update: publicProcedure
		.input(
			z.object({
				id: z.string(),
				data: z.object({
					name: z.string(),
					tag: z.string(),
				}),
			})
		)
		.mutation(async (req) => {
			const user = await updateUser(req.input.id, req.input.data);

			return user;
		}),

	updateAvatar: publicProcedure
		.input(
			z.object({
				id: z.string(),
				base64string: z.string(),
			})
		)
		.mutation(async (req) => {
			const avatar = await updateUserAvatar({
				id: req.input.id,
				avatar: req.input.base64string,
			});

			return avatar;
		}),

	getGroups: publicProcedure.input(z.string()).query(async (req) => {
		let groups = await getUserGroups(req.input);
		return groups;
	}),
});
