"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FolderOpen, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

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

  const deleteProject = async () => {
    setDeleting(true);

    await fetch(`http://localhost:5000/api/v1/project/${projectName}`, {
      method: "DELETE",
    });

    setDeleting(false);
    onDeleted?.();
    window.location.reload();
  };

  return (
    <div className="relative w-full">
      {/* GLOW */}
      <div
        className="absolute inset-0 rounded-xl blur-xl opacity-40 -z-10 pointer-events-none"
        style={{
          background: `
            linear-gradient(
              135deg,
              hsl(var(--primary)) 0%,
              hsl(var(--primary) / 0.6) 50%,
              hsl(var(--primary) / 0.3) 100%
            )
          `,
        }}
      />

      {/* CARD */}
      <div
        className="relative z-20 w-full rounded-xl border border-white/10 bg-background/60 backdrop-blur-xl shadow-xl p-5 flex flex-col gap-4 transition-all hover:scale-[1.03] hover:rotate-1 cursor-pointer"
        onClick={() => router.push(href)} // ⭐ card click navigation
      >
        <div className="flex items-center justify-between">
          {/* ICON + NAME */}
          <div className="flex items-center gap-4">
            <FolderOpen size={55} className="text-primary drop-shadow-md" />
            <h2 className="font-semibold text-xl tracking-wide">
              {projectName}
            </h2>
          </div>

          {/* DELETE BUTTON — works perfectly now */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                className="p-2 rounded-full hover:bg-red-500/10 transition-all"
                onClick={(e) => {
                  e.stopPropagation(); // ⭐ prevents navigation
                }}
              >
                <Trash2
                  size={26}
                  className="text-muted-foreground hover:text-red-500"
                />
              </button>
            </AlertDialogTrigger>

            <AlertDialogContent className="bg-black border-neutral-800 text-white">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-red-400">
                  Delete Project?
                </AlertDialogTitle>

                <AlertDialogDescription className="text-neutral-400">
                  Permanently delete{" "}
                  <span className="text-white">{projectName}</span>? <br />
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel className="bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 text-white">
                  Cancel
                </AlertDialogCancel>

                <AlertDialogAction
                  onClick={deleteProject}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
