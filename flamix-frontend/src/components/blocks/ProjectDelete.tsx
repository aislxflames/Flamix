"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { createProject, deleteProject } from "@/utils/project";
import { useRouter } from "next/navigation";

interface CreateProjectDialogProps {
  projectName: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function ProjectDelete({
  projectName,
  open,
  setOpen,
}: CreateProjectDialogProps) {
  const router = useRouter();
  const handelSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    deleteProject(projectName);
    router.refresh();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Project "{projectName}"</DialogTitle>
          <DialogDescription>
            Enter details for your new project
          </DialogDescription>
        </DialogHeader>

        <form className="grid gap-4" onSubmit={handelSubmit}>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Delete Project</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
