import { PrismaClient } from "@prisma/client";
export type { Group, Message, User } from "@prisma/client"

export const prisma = new PrismaClient();