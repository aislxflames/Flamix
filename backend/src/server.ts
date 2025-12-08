import express, { type Express } from "express";
import dotenv from "dotenv";
import routeController from "./routes/route.controller.js";
import run from "./utils/run.js";
import { Server } from "socket.io";
import { createServer } from "http";
import { logStore } from "./services/command.service.js";
import cors from "cors";

dotenv.config();

const app: Express = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const port = 5000;

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/api/v1", routeController);

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // When frontend wants OLD logs
  socket.on("subscribe", (channel) => {
    console.log(`Client subscribed to: ${channel}`);

    const logs = logStore[channel];
    if (logs && logs.length > 0) {
      logs.forEach((line) => {
        socket.emit(channel, line);
      });
    }
  });
});

server.listen(port, () => {
  console.log(`Application is running on http://localhost:${port}`);
});

export { io, app };
