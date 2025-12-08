import fs from "fs/promises";
import pathModule from "path";
import { runCmd } from "./command.service.js";
import { convertEnvToEnvFile } from "../utils/convertEnv.js";

class ComposeService {
  async up(name: string) {
    const projectPath = `/opt/flamix/projects/${name}`;
    runCmd(`cd ${projectPath} && docker compose up -d`, "test");
  }

  /**
   * Build Traefik rules for new domain objects
   */
buildTraefikLabels(name: string, containerName: string, domains: any[]) {
  if (!domains || domains.length === 0) {
    return `
      - "traefik.http.routers.${name}.rule=Host(\`localhost\`)"
      - "traefik.http.routers.${name}.entrypoints=web"
      - "traefik.http.services.${name}.loadbalancer.server.port=3000"
    `;
  }

  const labels: string[] = [];

  domains.forEach((d, index) => {
    const routerBase = `${name}-${containerName}-${index}`;

    const domain =
      d.domain ??
      d.host ??
      d.name ??
      d.url ??
      d.value ??
      null;

    const port = d.port ?? d.iPort ?? 3000;
    const ssl = d.ssl ?? false;

    if (!domain) {
      console.log("⚠️ Missing domain in entry:", d);
      return;
    }

    //
    // HTTP Router
    //
    labels.push(
      `- "traefik.http.routers.${routerBase}-http.rule=Host(\`${domain}\`)"`,
    );
    labels.push(
      `- "traefik.http.routers.${routerBase}-http.entrypoints=web"`,
    );
    labels.push(
      `- "traefik.http.routers.${routerBase}-http.service=${routerBase}-service"`
    );

    //
    // HTTPS Router
    //
    if (ssl) {
      labels.push(
        `- "traefik.http.routers.${routerBase}-https.rule=Host(\`${domain}\`)"`,
      );
      labels.push(
        `- "traefik.http.routers.${routerBase}-https.entrypoints=websecure"`,
      );
      labels.push(
        `- "traefik.http.routers.${routerBase}-https.tls=true"`
      );
      labels.push(
        `- "traefik.http.routers.${routerBase}-https.tls.certresolver=myresolver"`
      );
      labels.push(
        `- "traefik.http.routers.${routerBase}-https.service=${routerBase}-service"`
      );
    }

    //
    // Shared Service
    //
    labels.push(
      `- "traefik.http.services.${routerBase}-service.loadbalancer.server.port=${port}"`,
    );
  });

  return labels.join("\n      ");
}



  /**
   * Create docker-compose.yml
   */
  async create(
    name: string,
    containerName: string,
    image: string,
    env: any,
    domains: any[],
    internalPort: number,
    projectPath: string,
    channel: string,
  ) {
    await fs.mkdir(projectPath, { recursive: true });

    const envFile = convertEnvToEnvFile(env);
    const traefikLabels = this.buildTraefikLabels(name, containerName, domains);

    const composeYml = `
version: "3.9"
services:
  app:
    image: ${image}
    env_file:
      - ./container.env
    container_name: ${name}-${containerName}
    networks:
      - flamix-proxy
    labels:
      - "traefik.enable=true"
      ${traefikLabels}
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

    await runCmd(`cd ${projectPath} && docker compose up`, channel);
  }

  /**
   * Rewrite compose.yml on update
   */
  async rewrite(
    name: string,
    containerName: string,
    image: string,
    env: any,
    domains: any[],
    internalPort: number,
    projectPath: string,
  ) {
    const envFile = convertEnvToEnvFile(env);
    const traefikLabels = this.buildTraefikLabels(name, containerName, domains);

    const composeYml = `
version: "3.9"
services:
  app:
    image: ${image}
    env_file:
      - ./container.env
    container_name: ${name}-${containerName}
    networks:
      - flamix-proxy
    labels:
      - "traefik.enable=true"
      ${traefikLabels}
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
