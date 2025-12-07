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
import { deleteContainer } from "@/utils/container";

interface CreateProjectDialogProps {
  projectName: string;
  containerName: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function ContainerDelete({
  projectName,
  containerName,
  open,
  setOpen,
}: CreateProjectDialogProps) {
  const router = useRouter();
  const handelSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    deleteContainer(projectName, containerName);
    router.refresh();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Container "{containerName}"</DialogTitle>
          <DialogDescription>
            Are you sure you wanna delete {containerName} this container ?
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
            <Button type="submit">Delete Container</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
