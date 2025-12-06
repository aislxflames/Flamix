import fs from "fs";
import pathModule from "path";
import { runCmd } from "./command.service.js";

class ComposeService {
  async up(name: string) {
    const projectPath = `/opt/flamix/projects/${name}`;
    runCmd(`cd ${projectPath} && docker compose up -d`, "test");
  }

  /**
   * Creates a project folder + docker-compose.yml
   * @param name    project name / folder name
   * @param image   docker image name
   * @param domain  domain for traefik
   * @param internalPort container internal port
   */
  async create(
    name: string,
    image: string,
    domain: string,
    internalPort: number,
  ) {
    const projectPath = `/opt/flamix/projects/${name}`;

    // 1. Create folder
    fs.mkdirSync(projectPath, { recursive: true });

    // 2. Compose file content
    const composeYml = `
version: "3.9"
services:
  app:
    image: ${image}
    container_name: ${name}
    networks:
      - flamix-proxy
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.${name}.rule=Host(\`${domain}\`)"
      - "traefik.http.routers.${name}.entrypoints=websecure"
      - "traefik.http.routers.${name}.tls.certresolver=myresolver"
      - "traefik.http.services.${name}.loadbalancer.server.port=${internalPort}"
    restart: always
networks:
  flamix-proxy:
    external: true
`;

    // 3. Write docker-compose.yml
    fs.writeFileSync(
      pathModule.join(projectPath, "docker-compose.yml"),
      composeYml,
    );

    // 4. Start the container
    runCmd(`cd ${projectPath} && docker compose up`, "test");
  }
}

export const composeService = new ComposeService();
