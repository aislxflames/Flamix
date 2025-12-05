import { runCmd } from "./command.service.js";

class RailPack {
  async install() {
    runCmd(
      `docker run --rm --privileged -d --name buildkit moby/buildkit`,
      "test",
    );
  }
  async build(dir: string) {
    runCmd(`railpack build ${dir}`, "test", {
      env: {
        BUILDKIT_HOST: "docker-container://buildkit",
      },
    });
  }
}

export const railPack = new RailPack();
