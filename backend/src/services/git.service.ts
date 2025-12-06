import { runCmd } from "./command.service.js";

class GitService {
  async clone(url: string, path?: string) {
    runCmd(`git clone ${url} ${path}`, "test");
  }
  async pull(dir?: string) {
    runCmd(`git pull ${dir}`, "test");
  }
}

const gitService = new GitService();
