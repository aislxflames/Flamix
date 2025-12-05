import type { Request, Response } from "express";
import { Project } from "../models/project.model.js";
import connectDB from "../utils/connectDB.js";

export const createProject = async (req: Request, res: Response) => {
  try {
    connectDB();
    const { name } = req.body;

    const project = await Project.create({
      projectName: name,
      containers: [],
    });

    res.json({ success: true, project });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const getAllProject = async (req: Request, res: Response) => {
  try {
    connectDB();
    const project = await Project.find({});

    res.send(project);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const getProject = async (req: Request, res: Response) => {
  try {
    connectDB();
    const { projectName } = req.params;
    const project = await Project.findOne({ projectName: projectName });
    res.send(project);
  } catch (err) { }
};
