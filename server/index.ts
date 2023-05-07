import { Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { inferAsyncReturnType, initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import { prisma } from "./lib/prisma";

import { appRouter } from "./routes/_app";
import { createContext } from "./trpc";
import { messageHandler } from "./util/messageCreate";

// import groupController from "./controllers/groupController";
const express = require("express");
const bodyParser = require("body-parser");

const cors = require("cors");
const fileUpload = require("express-fileupload");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: "*",
	},
	maxHttpBufferSize: 64 * 1024 * 1024,
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

	socket.on("join", ({ group, user }: { group: string; user: string }) => {
		room = group;
		socket.join(room);
		socket.to(room).emit("join", user);
		socket.to(room).emit("status", {
			user: user,
			status: {
				title: "Idle",
				data: {},
			},
		});
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

		const message = await messageHandler(data, author.id);

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
