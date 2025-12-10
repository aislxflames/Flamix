"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Server, Trash2 } from "lucide-react";
import ContainerDelete from "../blocks/ContainerDelete";

interface ContainerCardProps {
  projectName: string;
  containerName: string;
  status: string;
  href: string;
  image?: string;
  env?: Record<string, any>;
  domains?: string[];
}

export default function ContainerCard({
  projectName,
  containerName,
  status,
  href,
  image,
  env,
  domains,
}: ContainerCardProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Format name
  const displayName = containerName
    .replace(/-/g, " ")
    .replace(/\b\w/g, char => char.toUpperCase());
    
  // Icon color based on status
  const iconColor: Record<string, string> = {
    stopped: "text-red-500",
    running: "text-green-500",
    starting: "text-orange-500",
    deploying: "text-blue-500",
  };

  // Card glow based on status
  const shadowColor: Record<string, string> = {
    stopped: "shadow-[0_0_20px_rgba(239,68,68,0.5)]",
    running: "shadow-[0_0_20px_rgba(34,197,94,0.5)]",
    starting: "shadow-[0_0_20px_rgba(249,115,22,0.5)]",
    deploying: "shadow-[0_0_20px_rgba(59,130,246,0.5)]",
  };

  const shadowHoverColor: Record<string, string> = {
    stopped: "hover:shadow-[0_0_35px_rgba(239,68,68,0.8)]",
    running: "hover:shadow-[0_0_35px_rgba(34,197,94,0.8)]",
    starting: "hover:shadow-[0_0_35px_rgba(249,115,22,0.8)]",
    deploying: "hover:shadow-[0_0_35px_rgba(59,130,246,0.8)]",
  };

  return (
    <div className="relative w-full">
      <div
        onClick={() => router.push(href)}
        className={`
          w-full rounded-xl border border-white/10 bg-background/60 backdrop-blur-xl shadow-0 
          p-5 flex flex-col gap-4 cursor-pointer transition-all
          hover:scale-[1.03] hover:rotate-1
          ${shadowColor[status]}
          ${shadowHoverColor[status]}
        `}
      >
        <div className="flex items-center justify-between">
          {/* ICON + NAME */}
          <div className="flex items-center gap-4">
            <Server
              size={55}
              className={`${iconColor[status]} drop-shadow-md`}
            />

            <div>
              <h2 className="font-semibold text-xl tracking-wide">
                {displayName}
              </h2>

              <p
                className={`text-sm capitalize font-semibold ${iconColor[status]}`}
              >
                Status: {status}
              </p>
            </div>
          </div>

          {/* DELETE BUTTON */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // prevents navigation
              setOpen(true);
            }}
            className="p-2 rounded-full hover:bg-red-500/10 transition-all cursor-pointer"
          >
            <Trash2
              size={26}
              className="text-muted-foreground hover:text-red-500"
            />
          </button>
        </div>
      </div>

      {/* DELETE MODAL */}
      <ContainerDelete
        open={open}
        setOpen={setOpen}
        projectName={projectName}
        containerName={containerName}
      />
    </div>
  );
}
