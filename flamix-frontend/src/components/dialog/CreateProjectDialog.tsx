"use client";

import { useState } from "react";
import CreateProject from "../blocks/CreateProject";
import { Button } from "../ui/button";
import { PlusSquareIcon, SquarePen } from "lucide-react";

export default function CreateProjectDialog() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div
        className="flex justify-center text-center items-center gap-2 font-bold"
        onClick={() => setOpen(true)}
      >
        <SquarePen size={16} />
        Create Project
      </div>
      <CreateProject open={open} setOpen={setOpen} />
    </>
  );
}
