import express, { Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import userController from "./controllers/userController";
import groupController from "./controllers/groupController";
import path from "path";

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
	socket.on("message", async (data) => {
		console.log(data);
	});
});

httpServer.listen(process.env.PORT, () => {
	console.log("listening on http://localhost:" + process.env.PORT);
});
