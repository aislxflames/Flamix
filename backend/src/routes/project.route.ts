import { Router } from "express";
import {
  createProject,
  getAllProject,
  getProject,
} from "../controllers/project.controller.js";
import containerRoute from "./container.route.js";

const router = Router();

router.post("/project", createProject);
router.get("/projects", getAllProject);
router.get("/project/:projectName", getProject);
router.use("/project", containerRoute);

export default router;
