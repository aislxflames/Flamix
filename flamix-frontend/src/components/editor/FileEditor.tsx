"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface FileEditorProps {
  initial: string;
  project: string;
  container: string;
  type: "compose" | "env";
}

export default function FileEditor({
  initial,
  project,
  container,
  type,
}: FileEditorProps) {
  const [value, setValue] = useState(initial || "");
  const [saving, setSaving] = useState(false);

  const saveFile = async () => {
    setSaving(true);
    try {
      const res = await fetch("http://localhost:5000/api/v1/container/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project,
          container,
          type,
          content: value,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        alert("Save failed: " + (data?.error || res.statusText));
      } else {
        alert("Saved ✓");
      }
    } catch (err: any) {
      alert("Save failed: " + err.message);
    }
    setSaving(false);
  };

  return (
    <div className="w-full space-y-3">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        spellCheck={false}
        className="
          w-full 
          min-h-[80vh]         /* FULL SCREEN EDITOR */
          md:min-h-[85vh]      /* even bigger on desktop */
          bg-black 
          border border-neutral-700 
          rounded-xl 
          p-4 
          text-white 
          text-sm 
          font-mono
          resize-y
          leading-6
          focus:outline-none 
          focus:border-primary
        "
      />

      <div className="flex gap-3">
        <Button
          onClick={saveFile}
          disabled={saving}
          className="bg-primary text-white px-6"
        >
          {saving ? "Saving..." : "Save"}
        </Button>

        <Button
          variant="secondary"
          disabled={saving}
          onClick={() => setValue(initial || "")}
          className="px-6"
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
