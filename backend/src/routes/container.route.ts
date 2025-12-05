import { Router } from "express";
import {
  createContainer,
  getAllContainer,
  getContainer,
} from "../controllers/container.controller.js";

const router = Router();

router.get("/:projectName/containers", getAllContainer);
router.post("/:projectName/container", createContainer);
router.get("/:projectName/container/:containerName", getContainer);

export default router;
