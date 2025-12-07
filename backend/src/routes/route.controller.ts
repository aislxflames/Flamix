import { Router } from "express";
import projectRoute from "./project.route.js";
import proxyRoute from "./proxy.route.js";

const route = Router();

route.use("/", projectRoute);
route.use("/", proxyRoute);

export default route;
