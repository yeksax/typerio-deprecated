import express, { Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import userController from "./controllers/userController";
import groupController from "./controllers/groupController";
import path from "path";
import { prisma } from "./lib/prisma";

const cors = require("cors");
const fileUpload = require("express-fileupload");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: "*",
	},
});

app.use(fileUpload());
app.use(express.json());
app.use(cors());

app.get("/files/:uid/*", function (req: Request, res: Response) {
	if (req.params) {
		var uid = req.params.uid,
			path = req.params[0];
		res.sendFile(path, { root: `./files/${uid}/` });
	}
});

app.use("/groups", groupController);
app.use("/user", userController);

io.on("connection", (socket) => {
	let room = "";

	socket.on("disconnect", () => {
		socket.removeAllListeners();
	});

	socket.on("join", (group) => {
		room = group;
		socket.join(room);
		console.log(socket.rooms);
	});

	socket.on("message", async (data) => {
		const author = await prisma.user.findUnique({
			where: {
				email: data.author.email,
			},
			select: {
				id: true,
			},
		});

		if (!author) return;

		const message = await prisma.message.create({
			data: {
				authorId: author.id,
				groupChatId: data.group.id,
				content: data.message,
			},
			include: {
				author: {
					select: {
						username: true,
						profilePicture: true,
					},
				},
			},
		});

		io.to(socket.id).emit("receiveMessage", { ...message, isAuthor: true });
		socket.to(room).emit("receiveMessage", message);
	});
});

httpServer.listen(process.env.PORT, () => {
	console.log("listening on http://localhost:" + process.env.PORT);
});
