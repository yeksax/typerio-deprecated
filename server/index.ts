import express, { Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import messageHandler from "./util/messageHandler";
import { Message, User, PrismaClient } from "@prisma/client";
import { log } from "console";
import groupChatController from "./controllers/groupChatController";
import userController from "./controllers/userController";

const cors = require("cors");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: "*",
	},
});

app.use(express.json());
app.use(cors());

interface MessageEventData {
	message: Message;
	author: {
		email: string;
		nickname: string;
	};
}

app.use("/groups", groupChatController);
app.use("/user", userController);

const prisma = new PrismaClient();

io.on("connection", (socket) => {
	socket.on("message", async (msg: MessageEventData) => {
		let author = await prisma.user.findFirst({
			where: {
				email: msg.author.email,
			},
		});

		if (!author) {
			author = await prisma.user.create({
				data: {
					email: msg.author.email,
					username: msg.author.nickname,
				},
			});
		} else {
			author = author;
		}

		msg.message.authorId = author.id;

		const message = await messageHandler(msg.message);
		console.log(message);
	});
});

httpServer.listen(3001, () => {
	console.log("listening on http://localhost:3001");
});
