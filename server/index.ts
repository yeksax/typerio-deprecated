import express, { Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { Message, User, PrismaClient } from "@prisma/client";
import groupChatController from "./controllers/groupChatController";
import userController from "./controllers/userController";
import { prisma } from "./lib/prisma";

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

app.use("/groups", groupChatController);
app.use("/user", userController);

io.on("connection", (socket) => {
	socket.on("message", async (data) => {
		console.log(data);
	});
});

httpServer.listen(3001, () => {
	console.log("listening on http://localhost:3001");
});
