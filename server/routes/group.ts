import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { getGroup, getGroups } from "../util/groupGet";
import { getGroupMessages } from "../util/groupGetMessages";
import { getGroupMembers } from "../util/groupGetMembers";
import { createGroup } from "../util/groupCreate";
import { appendGroupToUser } from "../util/userJoinGroup";
import { setThumbnail } from "../util/setGroupThumbnail";

export const groupRouter = router({
	create: publicProcedure
		.input(
			z.object({
				owner: z.string(),
				name: z.string(),
				description: z.string(),
			})
		)
		.mutation(async (req) => {
			const group = await createGroup(req.input);
			return group;
		}),

	setGroupImage: publicProcedure
		.input(z.object({ group: z.string(), image: z.string() }))
		.mutation(async (req) => {
			const group = await setThumbnail({
				id: req.input.group,
				thumbnail: req.input.image,
			});

			return group;
		}),

	getGroups: publicProcedure
		.input(z.string().optional())
		.query(async (req) => {
			let groups = await getGroups(req.input);
			return groups;
		}),

	getGroup: publicProcedure.input(z.string()).query(async (req) => {
		let group = await getGroup(req.input);
		return group;
	}),

	getMessages: publicProcedure
		.input(z.object({ group: z.string(), email: z.string() }))
		.query(async ({ input }) => {
			let messages = await getGroupMessages(input.group, input.email);
			return messages;
		}),

	getMembers: publicProcedure
		.input(z.object({ group: z.string(), email: z.string() }))
		.query(async ({ input }) => {
			let users = await getGroupMembers(input.group, input.email);
			return users;
		}),

	joinGroup: publicProcedure
		.input(z.object({ group: z.string(), user: z.string() }))
		.mutation(async (req) => {
			let group = await appendGroupToUser(
				req.input.user,
				req.input.group
			);
			return group;
		}),
});
