"use client";

import { Button } from "@/components/ui/button";
import {
  startContainer,
  stopContainer,
  installContainer,
  deleteContainer,
} from "@/utils/container";
import { Play, Square, Rocket, Trash2 } from "lucide-react";
import { useState } from "react";

export default function ContainerActions({
  project,
  container,
}: {
  project: string;
  container: string;
}) {
  const [loading, setLoading] = useState("");

  const run = async (label: string, fn: () => Promise<any>) => {
    setLoading(label);
    await fn();
    setLoading("");
  };

  return (
    <div
      className="
      bg-neutral-900/70 
      border border-neutral-800 
      rounded-xl 
      p-4 
      flex justify-center 
      gap-4 
      flex-wrap
      shadow-lg
    "
    >
      {/* START */}
      <Button
        variant="secondary"
        disabled={loading !== ""}
        onClick={() => run("Start", () => startContainer(project, container))}
        className="flex items-center gap-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-900/40"
      >
        <Play className="w-4 h-4" />
        {loading === "Start" ? "Starting..." : "Start"}
      </Button>

      {/* STOP */}
      <Button
        variant="secondary"
        disabled={loading !== ""}
        onClick={() => run("Stop", () => stopContainer(project, container))}
        className="flex items-center gap-2 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-300 border border-yellow-900/40"
      >
        <Square className="w-4 h-4" />
        {loading === "Stop" ? "Stopping..." : "Stop"}
      </Button>

      {/* DEPLOY */}
      <Button
        variant="secondary"
        disabled={loading !== ""}
        onClick={() =>
          run("Deploy", () => installContainer(project, container))
        }
        className="flex items-center gap-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-900/40"
      >
        <Rocket className="w-4 h-4" />
        {loading === "Deploy" ? "Deploying..." : "Deploy"}
      </Button>

      {/* DELETE */}
      <Button
        variant="destructive"
        disabled={loading !== ""}
        onClick={() => run("Delete", () => deleteContainer(project, container))}
        className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-900/50"
      >
        <Trash2 className="w-4 h-4" />
        {loading === "Delete" ? "Deleting..." : "Delete"}
      </Button>
    </div>
  );
}
