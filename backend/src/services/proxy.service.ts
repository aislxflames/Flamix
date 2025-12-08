import { dockerService } from "./docker.service.js";
import pathModule from "path";
import fs from "fs";
import { runCmd } from "./command.service.js";

const proxyName = "traefik";

class ProxyService {
  async install(channel: string) {
    const proxyPath = `/opt/flamix/proxy`;
    fs.mkdirSync(proxyPath, { recursive: true });

const composeYml = `
version: "3.9"

services:
  traefik:
    image: traefik:v2.11
    container_name: ${proxyName}
    command:
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"

      # HTTP & HTTPS EntryPoints
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"

      # REMOVE REDIRECT so HTTP works normally
      # (Do NOT include:
      #   --entrypoints.web.http.redirections.entrypoint.to=websecure
      # )

      # Let's Encrypt SSL on HTTPS
      - "--certificatesresolvers.myresolver.acme.httpchallenge=true"
      - "--certificatesresolvers.myresolver.acme.httpchallenge.entrypoint=web"
      - "--certificatesresolvers.myresolver.acme.email=your@email.com"
      - "--certificatesresolvers.myresolver.acme.storage=/letsencrypt/acme.json"

      - "--api.dashboard=true"

    ports:
      - "80:80"
      - "443:443"

    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock:ro"
      - "./letsencrypt:/letsencrypt"

    networks:
      - flamix-proxy

networks:
  flamix-proxy:
    external: true
`;


    fs.writeFileSync(
      pathModule.join(proxyPath, "docker-compose.yml"),
      composeYml,
    );

    await runCmd(`cd ${proxyPath} && docker compose up`, channel);
  }

  async stop(channel: string) {
    await dockerService.stop(proxyName, channel);
  }
  async start(channel: string) {
    await dockerService.start(proxyName, channel);
  }
  async delete(channel: string) {
    await dockerService.delete(proxyName, channel);
  }
  async log(channel: string) {
    await dockerService.watchLogs(proxyName, channel);
  }
}

export const proxyService = new ProxyService();
