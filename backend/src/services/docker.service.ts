import { runCmd } from "./command.service.js";

class DockerService {
  start(id: string, channel: string) {
    return runCmd(`docker start ${id}`, channel);
  }

  stop(id: string, channel: string) {
    return runCmd(`docker stop ${id}`, channel);
  }
  delete(id: string, channel: string) {
    return runCmd(`docker rm ${id}`, channel);
  }

  run(id: string, channel: string) {
    return runCmd(`docker run ${id}`, channel);
  }

  pull(id: string, channel: string) {
    return runCmd(`docker pull ${id}`, channel);
  }

  watchLogs(id: string, channel: string) {
    return runCmd(`docker logs --tail 500 -f ${id}`, channel);
  }
}

export const dockerService = new DockerService();
