"use client";

import { useEffect, useState } from "react";
import { socket } from "./socket";

export function useLogs(channel: string) {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    socket.connect();

    // clear logs
    setLogs([]);

    // request old logs from server
    socket.emit("subscribe", channel);

    // listen for logs from ANY channel
    socket.onAny((event, data) => {
      if (event === channel) {
        setLogs((prev) => [...prev, data]);
      }
    });

    return () => {
      socket.offAny();
    };
  }, [channel]);

  return {
    logs,
    clear: () => setLogs([]),
  };
}
