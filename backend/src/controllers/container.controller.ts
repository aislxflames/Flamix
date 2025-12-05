import type { Request, Response } from "express";
import { Project } from "../models/project.model.js";
import connectDB from "../utils/connectDB.js";

export const createContainer = async (req: Request, res: Response) => {
  try {
    connectDB();
    const { projectName } = req.params;
    const { name, image, env, ports } = req.body;
    const project = await Project.findOne({ projectName });
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
    project.containers.push({
      name,
      image,
      env,
      ports,
    });
    await project.save();
    res
      .status(201)
      .json({ success: true, message: "Container Created Successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
};

export const getAllContainer = async (req: Request, res: Response) => {
  connectDB();
  const { projectName } = req.params;
  const project = await Project.findOne({ projectName });
  res.send(project.containers);
};

export const getContainer = async (req: Request, res: Response) => {
  connectDB();
  const { projectName, containerName } = req.params;
  const project = await Project.findOne({ projectName });
  const container = project?.containers.find((c) => c.name === containerName);

  res.send(container);
};
