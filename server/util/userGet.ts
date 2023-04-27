import { prisma } from "../lib/prisma";

export async function getUser(email: string) {
	const user = await prisma.user.findUnique({
		where: {
			email: email,
		},
	});

	return user;
}
