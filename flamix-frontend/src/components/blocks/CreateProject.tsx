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
import { createProject } from "@/utils/project";
import { useRouter } from "next/navigation";

interface CreateProjectDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function CreateProject({
  open,
  setOpen,
}: CreateProjectDialogProps) {
  const [projectName, setProjectName] = useState("");

  const router = useRouter();

  const handelSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = projectName.toLowerCase().replace(/\s+/g, "-");
    createProject(name);
    setOpen(false);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Project Creation</DialogTitle>
          <DialogDescription>
            Enter details for your new project
          </DialogDescription>
        </DialogHeader>

        <form className="grid gap-4" onSubmit={handelSubmit}>
          <div className="grid gap-3">
            <Label htmlFor="name-1">Project Name</Label>

            <Input
              id="name-1"
              name="name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter Project Name"
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="Enviorement">Env Variables</Label>
            <Textarea
              id="Enviorement"
              name="Enviorement"
              defaultValue="NODE_ENV=PRODUCTION"
              spellCheck={false}
              autoCorrect="off"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Project</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
