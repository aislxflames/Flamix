"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FolderOpen, Trash2 } from "lucide-react";
import ProjectDelete from "../blocks/ProjectDelete";

interface ProjectCardProps {
  projectName: string;
  onDeleted?: () => void;
  href: string;
}

export default function ProjectCard({
  projectName,
  onDeleted,
  href,
}: ProjectCardProps) {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const [open, setOpen] = useState(false);
  return (
    <div className="relative w-full bg-background/40">
      {/* GLOW */}

      {/* <Link href={href}> */}
      <div
        onClick={() => router.push(href)}
        className=" w-full rounded-xl border border-white/10 bg-background/60 backdrop-blur-xl shadow-xl p-5 flex flex-col gap-4 transition-all hover:scale-[1.03] hover:rotate-1 cursor-pointer"
      >
        <div className="flex items-center justify-between">
          {/* ICON + NAME */}
          <div className="flex items-center gap-4">
            <FolderOpen size={55} className="text-primary drop-shadow-md" />
            <h2 className="font-semibold text-xl tracking-wide">
              {projectName}
            </h2>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
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

      <ProjectDelete open={open} setOpen={setOpen} projectName={projectName} />
    </div>
  );
}
