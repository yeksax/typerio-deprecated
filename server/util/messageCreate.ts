import { Message, PrismaClient } from "@prisma/client";

export default async function messageHandler(data: Message) {
	const prisma = new PrismaClient();
	let newMessage = await prisma.message.create({ data: data });

	await prisma.$disconnect();
	return newMessage;
}
