import { runCmd } from "./command.service.js";

class DockerService {
  async start(id: String) {
    runCmd(`docker start ${id}`, "test");
  }
  async stop(id: String) {
    runCmd(`docker stop ${id}`, "test");
  }
  async run(id: String) {
    runCmd(`docker run ${id}`, "test");
  }
  async pull(id: String) {
    runCmd(`docker pull ${id}`, "test");
  }
}

export const dockerService = new DockerService();
