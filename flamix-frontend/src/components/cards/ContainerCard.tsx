"use client";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Server, Trash2, ExternalLink, Circle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ContainerCard({
  projectName,
  name,
  image,
  env,
  status,
  domains,
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const domainList = Array.isArray(domains) ? domains : [];

  const statusColor = {
    running: "text-green-400 border-green-500/40",
    stopped: "text-red-400 border-red-500/40",
    starting: "text-orange-400 border-orange-500/40",
    deploying: "text-blue-400 border-blue-500/40",
  }[status];

  const deleteContainer = async () => {
    setLoading(true);
    await fetch(
      `http://localhost:5000/api/v1/project/${projectName}/container/${name}/delete`,
      { method: "DELETE" },
    );
    window.location.reload();
  };

  return (
    <Card
      className={cn(
        "rounded-2xl p-5",
        "bg-black border border-neutral-800",
        "shadow-[0_0_40px_-18px_rgba(255,255,255,0.1)]",
        "hover:shadow-[0_0_55px_-10px_rgba(255,255,255,0.2)]",
        "transition-all",
      )}
    >
      {/* HEADER */}
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800">
            <Server className="w-5 h-5 text-neutral-300" />
          </div>

          <CardTitle className="text-white text-lg font-semibold">
            {name}
          </CardTitle>
        </div>

        <Badge
          className={cn(
            "px-3 py-1 text-xs font-medium border",
            "bg-neutral-900",
            statusColor,
          )}
        >
          <Circle className="w-2 h-2 fill-current mr-1" />
          {status.toUpperCase()}
        </Badge>
      </CardHeader>

      {/* CONTENT */}
      <CardContent className="text-sm text-neutral-300 space-y-4">
        {/* IMAGE */}
        <div className="flex justify-between">
          <span className="text-neutral-500">Image:</span>
          <span>{image}</span>
        </div>

        {/* DOMAINS */}
        {domainList.length > 0 && (
          <div className="space-y-1">
            <span className="text-neutral-500">Domains:</span>
            {domainList.map((d) => (
              <p key={d} className="text-neutral-300 text-xs">
                • {d}
              </p>
            ))}
          </div>
        )}

        {/* ENV */}
        <div>
          <span className="text-neutral-500">Environment:</span>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-xs space-y-2 mt-1">
            {Object.entries(env).map(([k, v]) => (
              <div key={k} className="flex justify-between text-neutral-300">
                <span>{k}</span>
                <span className="opacity-70">{String(v)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-between pt-3">
          <Button
            className="bg-neutral-900 border border-neutral-700 text-neutral-200 hover:bg-neutral-800"
            onClick={() =>
              router.push(`/dashboard/project/${projectName}/${name}`)
            }
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            Open
          </Button>

          <Button
            variant="destructive"
            disabled={loading}
            onClick={deleteContainer}
            className="flex items-center gap-1"
          >
            <Trash2 className="w-4 h-4" />
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
