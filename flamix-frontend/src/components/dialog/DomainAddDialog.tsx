"use client";

import { useState } from "react";
import DomainAdd from "../blocks/DomainAdd";
import { Button } from "../ui/button";

interface DomainAddDialogProps {
  projectName: string;
  containerName: string;
}

export default function DomainAddDialog({
  projectName,
  containerName,
}: DomainAddDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-muted/30 border border-border rounded-xl p-6 space-y-4 shadow-sm">
      {/* You can place this button wherever in parent */}
      <div className="flex justify-between">
        <h2 className={`text-xl font-semibold tracking-wide `}>Domains</h2>

        <Button onClick={() => setOpen(true)} variant={"default"}>
          Add Domain
        </Button>
      </div>

      {/* DomainAdd dialog */}
      <DomainAdd
        projectName={projectName}
        containerName={containerName}
        open={open}
        setOpen={setOpen}
      />
    </div>
  );
}
