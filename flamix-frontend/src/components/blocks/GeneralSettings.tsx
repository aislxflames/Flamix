"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getContainer, updateContainer } from "@/utils/container";
import { useRouter } from "next/navigation";

export default function GeneralSettings({
  projectName,
  containerName,
}: {
  projectName: string;
  containerName: string;
}) {
  const router = useRouter();

  const [gitUrl, setGitUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch current container info
  useEffect(() => {
    async function load() {
      const res = await getContainer(projectName, containerName);
      if (res?.container?.gitUrl) {
        setGitUrl(res.container.gitUrl);
      }
    }
    load();
  }, [projectName, containerName]);

  const save = async () => {
    setLoading(true);

    await updateContainer(projectName, containerName, {
      gitUrl,
    });

    setLoading(false);
    router.refresh();
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label>Git Repository URL</Label>
        <Input
          placeholder="https://github.com/username/repo"
          value={gitUrl}
          onChange={(e) => setGitUrl(e.target.value)}
        />
      </div>

      <Button onClick={save} disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}
