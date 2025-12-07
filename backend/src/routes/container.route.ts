import { Router } from "express";
import {
  createContainer,
  deleteContainer,
  getAllContainer,
  getContainer,
  installContainer,
  startContainer,
  stopContainer,
  updateContainer,
} from "../controllers/container.controller.js";

const router = Router();

router.get("/:projectName/containers", getAllContainer);
router.get("/:projectName/container/:containerName", getContainer);

router.post("/:projectName/container/:containerName/install", installContainer);
router.post("/:projectName/container/:containerName/start", startContainer);
router.post("/:projectName/container/:containerName/stop", stopContainer);

router.post("/:projectName/container", createContainer);
router.delete("/:projectName/container/:containerName/delete", deleteContainer);
router.put("/:projectName/container/:containerName/update", updateContainer);

export default router;
