import http from "http";

const server = http.createServer((req, res) => {
  res.end("Hello Aislx ❤️ — Your Traefik setup works!");
});

server.listen(3000, () => console.log("App running on port 3000"));
