"use client";

import { IconFolderCode } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import CreateProject from "./CreateProject";
import { useState } from "react";

export function EmptyProject() {
  const [open, setOpen] = useState(false);

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconFolderCode />
        </EmptyMedia>
        <EmptyTitle>No Projects Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any projects yet. Get started by creating
          your first project.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button onClick={() => setOpen(true)}>Create Project</Button>
          <CreateProject open={open} setOpen={setOpen}></CreateProject>
        </div>
      </EmptyContent>
    </Empty>
  );
}
