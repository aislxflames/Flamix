import type { Request, Response } from "express";
import { proxyService } from "../services/proxy.service.js";

export const installProxy = async (req: Request, res: Response) => {
  try {
    await proxyService.install("proxy");
    res.json({message: "Proxy Installation Started"})
    proxyService.log("proxy");

    return res.status(200).json({
      success: true,
      message: "Proxy Installed Successfully.",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Failed to install proxy.",
      error: e?.message,
    });
  }
};

export const stopProxy = async (req: Request, res: Response) => {
  try {
    await proxyService.stop("proxy");

    return res.status(200).json({
      success: true,
      message: "Proxy Stopped Successfully.",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Failed to stop proxy.",
      error: e?.message,
    });
  }
};

export const startProxy = async (req: Request, res: Response) => {
  try {
    await proxyService.start("proxy");
    proxyService.log("proxy");

    return res.status(200).json({
      success: true,
      message: "Proxy Started Successfully.",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Failed to start proxy.",
      error: e?.message,
    });
  }
};
