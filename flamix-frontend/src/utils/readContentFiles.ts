import fs from "fs/promises";
import path from "path";

export async function getComposeFile(project: string, container: string) {
  try {
    const filePath = `/opt/flamix/projects/${project}-${container}/docker-compose.yml`;
    return await fs.readFile(filePath, "utf8");
  } catch (e) {
    return "⚠️ docker-compose.yml not found.";
  }
}

export async function getEnvFile(project: string, container: string) {
  try {
    const filePath = `/opt/flamix/projects/${project}-${container}/container.env`;
    return await fs.readFile(filePath, "utf8");
  } catch (e) {
    return "⚠️ container.env file not found.";
  }
}
