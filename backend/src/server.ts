import express, { type Express } from "express";
import dotenv from "dotenv";
import routeController from "./routes/route.controller.js";
import run from "./utils/run.js";
import { Server } from "socket.io";
import { createServer } from "http";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// IMPORTANT: import logStore from command.service
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

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use("/api/v1", routeController);

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get("/test", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

app.get("/gg", async (req, res) => {
  res.send("ok");
});

// SOCKET.IO LOGIC
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

  // Example command output stream
  run("ping google.com", (line) => {
    socket.emit("cmd_output", line);
  });
});

server.listen(port, () => {
  console.log(`Application is running on http://localhost:${port}`);
});

export { io, app };
