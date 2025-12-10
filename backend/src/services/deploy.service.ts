
import { gitService } from "./git.service.js";
import { railPack } from "./railpack.service.js";

class DeployService {
  async start(gitUrl: string, projectPath: string, channel: string) {
    await gitService.clone(gitUrl, channel, projectPath);
    await railPack.install();
    await railPack.build(projectPath, channel);
  }
}

export const deployService = new DeployService();
