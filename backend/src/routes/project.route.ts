import { Router, type Router as RouterType } from "express";
import {
  createProject,
  deleteProject,
  getAllProject,
  getProject,
} from "../controllers/project.controller.js";
import containerRoute from "./container.route.js";

const router: RouterType = Router();

router.post("/project", createProject);
router.get("/projects", getAllProject);
router.get("/project/:projectName", getProject);
router.delete("/project/:projectName", deleteProject);

router.use("/project", containerRoute);

export default router;
