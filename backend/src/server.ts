import express, { type Express, type Request, type Response } from "express";
import dotenv from "dotenv";
import projectRouter from "./routes/project.route.js";
import run from "./utils/run.js";
import { Server } from "socket.io";
import { createServer } from "http";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { dockerService } from "./services/docker.service.js";
import { railPack } from "./services/railpack.service.js";

dotenv.config();

const app: Express = express();
const server = createServer(app);
const io = new Server(server);

const port = 3000;

app.use(express.json());
app.use("/", projectRouter);

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get("/test", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});
app.get("/gg", (req, res) => {
  railPack.install();
  railPack.build("/run/media/devhub/Projects/flamenodes-website");
});

io.on("connection", (socket) => {
  console.log("a user connected");

  run("ping google.com", (line) => {
    socket.emit("cmd_output", line);
  });
});

server.listen(port, () => {
  console.log(`Application is running on http://localhost${port}`);
});

export { io, app };
