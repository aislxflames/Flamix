"use client";

import { useState } from "react";
import CreateContainer from "../blocks/CreateContainer";
import { Button } from "../ui/button";

export default function CreateContainerDialog(name: string) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button onClick={() => setOpen(true)}>Create Container</Button>
      <CreateContainer open={open} setOpen={setOpen} projectName={name} />
    </div>
  );
}
