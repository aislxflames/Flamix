import type { Request, Response } from "express";
import { Project } from "../models/project.model.js";
import connectDB from "../utils/connectDB.js";
import { composeService } from "../services/compose.service.js";
import { runCmd } from "../services/command.service.js";
import { deployService } from "../services/deploy.service.js";
import { dockerService } from "../services/docker.service.js";

// Update container status
const updateStatus = async (
  project: any,
  containerName: string,
  status: string,
) => {
  const container = project.containers.find(
    (c: any) => c.name === containerName,
  );
  if (!container) return;
  container.status = status;
  await project.save();
};

// Normalize domain objects
const normalizeDomains = (domains: any[] = []) =>
  domains.map((d) => ({
    domain: d.domain,
    displayName: d.displayName || d.domain,
    port: Number(d.port) || 80,
    ssl: Boolean(d.ssl),
  }));

export const createContainer = async (req: Request, res: Response) => {
  try {
    connectDB();
    const { projectName } = req.params;
    let { name, image, env, ports, gitUrl, domains } = req.body;

    const project = await Project.findOne({ projectName });
    if (!project)
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });

    if (!image || image.trim() === "") {
      image = `${projectName}-${name}`;
    }

    project.containers.push({
      name,
      image,
      env,
      ports,
      gitUrl,
      domains: normalizeDomains(domains),
      status: "Stopped",
    });

    await project.save();

    res.status(201).json({
      success: true,
      message: "Container created successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

export const deleteContainer = async (req: Request, res: Response) => {
  try {
    connectDB();
    const { projectName, containerName } = req.params;

    const project = await Project.findOne({ projectName });
    if (!project)
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });

    const index = project.containers.findIndex((c) => c.name === containerName);
    if (index === -1)
      return res
        .status(404)
        .json({ success: false, message: "Container not found" });

    project.containers.splice(index, 1);
    await project.save();

    const projectPath = `/opt/flamix/projects/${projectName}-${containerName}`;
    const channel = `${projectName}-${containerName}`;

    await dockerService.stop(channel, channel);
    await dockerService.delete(`${projectName}-${containerName}`, channel);
    await runCmd(`rm -rf ${projectPath}`, channel);

    res.json({ success: true, message: "Container deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Container not found.", error });
  }
};

export const getAllContainer = async (req: Request, res: Response) => {
  try {
    connectDB();
    const { projectName } = req.params;

    const project = await Project.findOne({ projectName });

    if (!project)
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });

    res.json({
      success: true,
      containers: project.containers,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Container not found.", error });
  }
};

export const getContainer = async (req: Request, res: Response) => {
  try {
    connectDB();
    const { projectName, containerName } = req.params;

    const project = await Project.findOne({ projectName });
    if (!project)
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });

    const container = project.containers.find((c) => c.name === containerName);

    if (!container)
      return res
        .status(404)
        .json({ success: false, message: "Container not found" });

    res.json({ success: true, container });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Container not found.", error });
  }
};

export const startContainer = async (req: Request, res: Response) => {
  try {
    connectDB();
    const { projectName, containerName } = req.params;

    const project = await Project.findOne({ projectName });
    if (!project)
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });

    const container = project.containers.find((c) => c.name === containerName);
    if (!container)
      return res
        .status(404)
        .json({ success: false, message: "Container not found" });

    const channel = `${projectName}-${containerName}`;

    await updateStatus(project, containerName, "Starting");

    await dockerService.start(channel, channel);
    dockerService.watchLogs(channel, channel);

    await updateStatus(project, containerName, "Running");

    res.json({
      success: true,
      channel,
      message: "Container started successfully",
    });
  } catch (e) {
    const project = await Project.findOne({
      projectName: req.params.projectName,
    });
    if (project)
      await updateStatus(project, req.params.containerName, "Stopped");

    res.status(500).json({
      success: false,
      message: "An error occurred while container starting",
      e,
    });
  }
};

export const stopContainer = async (req: Request, res: Response) => {
  try {
    connectDB();
    const { projectName, containerName } = req.params;

    const project = await Project.findOne({ projectName });
    if (!project)
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });

    const container = project.containers.find((c) => c.name === containerName);
    if (!container)
      return res
        .status(404)
        .json({ success: false, message: "Container not found" });

    const channel = `${projectName}-${containerName}`;

    await dockerService.stop(channel, channel);

    await updateStatus(project, containerName, "Stopped");

    res.json({
      success: true,
      channel,
      message: "Container stopped successfully",
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "An error occurred while container stopping",
      e,
    });
  }
};

export const installContainer = async (req: Request, res: Response) => {
  try {
    connectDB();
    const { projectName, containerName } = req.params;

    const project = await Project.findOne({ projectName });
    if (!project)
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });

    const container = project.containers.find((c) => c.name === containerName);
    if (!container)
      return res
        .status(404)
        .json({ success: false, message: "Container not found" });

    const channel = `${projectName}-${containerName}`;
    const projectPath = `/opt/flamix/projects/${projectName}-${containerName}`;

    await updateStatus(project, containerName, "Deploying");

    await runCmd(`rm -rf ${projectPath}`, channel);
    await deployService.start(container.gitUrl, projectPath, channel);

    const domainList = container.domains || [];


    await composeService.create(
      projectName,
      containerName,
      container.image,
      container.env,
      domainList,
      container.ports?.[0]?.iPort,
      projectPath,
      channel,
    );

    dockerService.watchLogs(channel, channel);

    await updateStatus(project, containerName, "Stopped");

    res.json({
      success: true,
      channel,
      message: "Container installation started",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "An error occurred", error });
  }
};

export const updateContainer = async (req: Request, res: Response) => {
  try {
    connectDB();
    const { projectName, containerName } = req.params;
    const { name, image, env, domains, ports } = req.body;

    const project = await Project.findOne({ projectName });
    if (!project)
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });

    const container = project.containers.find((c) => c.name === containerName);
    if (!container)
      return res
        .status(404)
        .json({ success: false, message: "Container not found" });

    if (name) container.name = name;
    if (image) container.image = image;
    if (env) container.env = env;
    if (ports) container.ports = ports;
    if (domains) container.domains = normalizeDomains(domains);

    await project.save();

    const projectPath = `/opt/flamix/projects/${projectName}-${containerName}`;
    const channel = `${projectName}-${containerName}`;

    const domainList = container.domains || [];

    await composeService.rewrite(
      projectName,
      containerName,
      container.image,
      container.env,
      domainList,
      container.ports?.[0]?.iPort,
      projectPath,
    );

    dockerService.watchLogs(channel, channel);
    await updateStatus(project, containerName, "Stopped");

    res.json({
      success: true,
      channel,
      message: "Container updated successfully",
    });
  } catch (e) {
    res
      .status(500)
      .json({ success: false, message: "Error updating container", error: e });
  }
};
