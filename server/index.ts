import express, { Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { inferAsyncReturnType, initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import { prisma } from "./lib/prisma";

import { appRouter } from "./routes/_app";
import { createContext } from "./trpc";
import bodyParser from "body-parser";
// import groupController from "./controllers/groupController";

const cors = require("cors");
const fileUpload = require("express-fileupload");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: "*",
	},
});

app.use(bodyParser({ limit: "32mb" }));
app.use(fileUpload());
app.use(express.json());
app.use(cors());

app.use(
	"/trpc",
	trpcExpress.createExpressMiddleware({
		router: appRouter,
		createContext,
	})
);

// app.use("/groups", groupController);

app.get("/files/:uid/*", function (req: Request, res: Response) {
	if (req.params) {
		var uid = req.params.uid,
			path = req.params[0];
		res.sendFile(path, { root: `./files/${uid}/` });
	}
});

io.on("connection", (socket) => {
	let room = "";

	socket.on("disconnect", () => {
		socket.removeAllListeners();
	});

	socket.on("join", (group) => {
		room = group;
		socket.join(room);
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
		console.log(data);

		const message = await prisma.message.create({
			data: {
				authorId: author.id,
				groupChatId: data.group.id,
				content: data.message,
				mentionedMessageId: data.mention,
			},
			include: {
				author: {
					select: {
						username: true,
						profilePicture: true,
						name: true,
						tag: true,
					},
				},
				mentionedMessage: {
					include: {
						author: true,
					},
				},
			},
		});

		io.to(socket.id).emit("receiveMessage", { ...message, isAuthor: true });
		socket.to(room).emit("receiveMessage", message);
	});

	socket.on("status", async (data) => {
		io.to(room).emit("status", data);
	});
});

httpServer.listen(process.env.PORT, () => {
	console.log("listening on http://localhost:" + process.env.PORT);
});
