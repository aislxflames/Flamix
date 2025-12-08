// src/utils/socket.ts
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000"; // your server

export const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: false, // connect manually
});
