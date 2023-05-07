import { prisma } from "../lib/prisma";

export async function getUser(username: string) {
	return await prisma.user.findUnique({
		where: {
			username: username,
		}
	});
}

export async function getUserByEmail(email: string) {
	return await prisma.user.findUnique({
		where: {
			email: email,
		},
	});
}

export async function getProfile(username: string) {
	return await prisma.user.findUnique({
		where: {
			email: username,
		},
		include: {
			_count: {
				select: {
					followedBy: true,
					groupChats: true,
					following: true,
				},
			},
		},
	});
}

export async function getProfileByEmail(email: string) {
	return await prisma.user.findUnique({
		where: {
			email: email,
		},
		include: {
			_count: {
				select: {
					followedBy: true,
					groupChats: true,
					following: true,
				},
			},
		},
	});
}
