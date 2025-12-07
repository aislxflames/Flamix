import fs from "fs/promises";
import pathModule from "path";
import { runCmd } from "./command.service.js";
import { convertEnvToEnvFile } from "../utils/convertEnv.js";

class ComposeService {
  async up(name: string) {
    const projectPath = `/opt/flamix/projects/${name}`;
    runCmd(`cd ${projectPath} && docker compose up -d`, "test");
  }

  buildDomainsRule(domains: string[]) {
    if (!domains || domains.length === 0) return "`localhost`";
    return domains.map((d) => `\`${d}\``).join(", ");
  }

  /**
   * Creates project folder + docker-compose.yml + env file
   */
  async create(
    name: string,
    containerName: string,
    image: string,
    env: any,
    domains: string[],
    internalPort: number,
    projectPath: string,
    channel: string,
  ) {
    await fs.mkdir(projectPath, { recursive: true });

    const domainRule = this.buildDomainsRule(domains);
    const envFile = convertEnvToEnvFile(env);

    const composeYml = `
version: "3.9"
services:
  app:
    image: ${image}
    env_file:
      - ./container.env
    container_name: ${name}-${containerName}
    ports:
      - "${internalPort}"
    networks:
      - flamix-proxy
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.${name}.rule=Host(${domainRule})"
      - "traefik.http.routers.${name}.entrypoints=websecure"
      - "traefik.http.routers.${name}.tls.certresolver=myresolver"
      - "traefik.http.services.${name}.loadbalancer.server.port=${internalPort}"
    restart: always

networks:
  flamix-proxy:
    external: true
`;

    await fs.writeFile(
      pathModule.join(projectPath, "docker-compose.yml"),
      composeYml,
    );

    await fs.writeFile(pathModule.join(projectPath, "container.env"), envFile);

    await runCmd(`cd ${projectPath} && docker compose up -d`, channel);
  }

  /**
   * Rewrites compose + env file on update
   */
  async rewrite(
    name: string,
    containerName: string,
    image: string,
    env: any,
    domains: string[],
    internalPort: number,
    projectPath: string,
  ) {
    const domainRule = this.buildDomainsRule(domains);
    const envFile = convertEnvToEnvFile(env);

    const composeYml = `
version: "3.9"
services:
  app:
    image: ${image}
    env_file:
      - ./container.env
    container_name: ${name}-${containerName}
    ports:
      - "${internalPort}"
    networks:
      - flamix-proxy
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.${name}.rule=Host(${domainRule})"
      - "traefik.http.routers.${name}.entrypoints=websecure"
      - "traefik.http.routers.${name}.tls.certresolver=myresolver"
      - "traefik.http.services.${name}.loadbalancer.server.port=${internalPort}"
    restart: always

networks:
  flamix-proxy:
    external: true
`;

    await fs.writeFile(
      pathModule.join(projectPath, "docker-compose.yml"),
      composeYml,
    );

    await fs.writeFile(pathModule.join(projectPath, "container.env"), envFile);
  }
}

export const composeService = new ComposeService();
