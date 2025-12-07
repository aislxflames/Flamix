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

import fs from "fs";
import path from "path";

const router = Router();

router.get("/:projectName/containers", getAllContainer);
router.get("/:projectName/container/:containerName", getContainer);

router.post("/:projectName/container/:containerName/install", installContainer);
router.post("/:projectName/container/:containerName/start", startContainer);
router.post("/:projectName/container/:containerName/stop", stopContainer);

router.post("/:projectName/container", createContainer);
router.delete("/:projectName/container/:containerName/delete", deleteContainer);
router.put("/:projectName/container/:containerName/update", updateContainer);

router.post("/container/save", async (req, res) => {
  try {
    const { project, container, type, content } = req.body;

    const base = `/opt/flamix/projects/${project}-${container}`;

    const filePath =
      type === "compose"
        ? `${base}/docker-compose.yml`
        : `${base}/container.env`;

    fs.writeFileSync(filePath, content, "utf8");

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
