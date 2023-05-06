import { PrismaClient } from "@prisma/client";
export type { Group, Message, User, File, Post, DirectMessage } from "@prisma/client"

export const prisma = new PrismaClient();