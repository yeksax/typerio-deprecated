import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
	/* options */
});

io.on("connection", (socket) => {
	console.log("connnected");
	socket.on("message", (msg) => {
		console.log(msg);
	});
});

httpServer.listen(3001, () => {
	console.log("listening on http://localhost:3001");
});
