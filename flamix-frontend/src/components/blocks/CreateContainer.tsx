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
import { createContainer } from "@/utils/container";
import { useRouter } from "next/navigation";

interface CreateContainerDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  projectName: string;
}

export default function CreateContainer({
  open,
  setOpen,
  projectName,
}: CreateContainerDialogProps) {
  const [containerName, setContainerName] = useState("");
  const [gitUrl, setGitUrl] = useState("");
  const [envText, setEnvText] = useState("NODE_ENV=PRODUCTION");
  const [port, setPort] = useState("3000");
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const name = containerName.toLowerCase().replace(/\s+/g, "-");

    // ENV parsing
    const env: Record<string, string> = {};
    envText.split("\n").forEach((line) => {
      const [key, value] = line.split("=");
      if (key && value) env[key.trim()] = value.trim();
    });

    const ports = [{ iPort: Number(port) }];

    await createContainer(projectName, {
      name,
      env,
      gitUrl,
      ports,
      // ❌ No domains here
    });

    setLoading(false);
    setOpen(false);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Container</DialogTitle>
          <DialogDescription>
            Enter details for your new container
          </DialogDescription>
        </DialogHeader>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          {/* Container Name */}
          <div className="grid gap-3">
            <Label>Container Name</Label>
            <Input
              value={containerName}
              onChange={(e) => setContainerName(e.target.value)}
              placeholder="Enter container name"
              required
            />
          </div>

          {/* Git URL */}
          <div className="grid gap-3">
            <Label>Git Repository URL</Label>
            <Input
              value={gitUrl}
              onChange={(e) => setGitUrl(e.target.value)}
              placeholder="https://github.com/username/repo"
            />
          </div>

          {/* ENV VARS */}
          <div className="grid gap-3">
            <Label>Environment Variables</Label>
            <Textarea
              value={envText}
              onChange={(e) => setEnvText(e.target.value)}
              className="font-mono"
            />
          </div>

          {/* PORT */}
          <div className="grid gap-3">
            <Label>Internal Port</Label>
            <Input
              type="number"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              placeholder="3000"
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
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Container"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
