import { Router } from "express";
import {
  installProxy,
  startProxy,
  stopProxy,
} from "../controllers/proxy.controller.js";

const route = Router();

route.post("/proxy/install", installProxy);
route.post("/proxy/start", startProxy);
route.post("/proxy/stop", stopProxy);

export default route;
