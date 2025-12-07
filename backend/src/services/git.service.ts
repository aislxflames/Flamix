import { runCmd } from "./command.service.js";

class GitService {
  async clone(url: string, path?: string, channel: string) {
    await runCmd(`mkdir -p ${path}`, channel);
    await runCmd(`git clone ${url} ${path}`, channel);
  }
  async pull(dir?: string, channel: string) {
    runCmd(`git pull ${dir}`, channel);
  }
}

export const gitService = new GitService();
