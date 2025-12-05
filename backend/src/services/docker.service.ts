import { runCmd } from "./command.service.js";

class DockerService {
  async start(id: String) {
    runCmd(`docker run ${id}`, "test");
  }
}

export const dockerService = new DockerService();
