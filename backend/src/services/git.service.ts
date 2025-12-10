import { runCmd } from "./command.service.js";

class GitService {
  async clone(url: string, channel: string, path?: string) {
    await runCmd(`mkdir -p ${path}`, channel);
    await runCmd(`git clone ${url} ${path}`, channel);
  }
  async pull(channel: string, dir?: string) {
    runCmd(`git pull ${dir}`, channel);
  }
}

export const gitService = new GitService();
