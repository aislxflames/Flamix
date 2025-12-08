"use client";

interface FileEditorProps {
  initial: string;
  project: string;
  container: string;
  type: "compose" | "env";
}

export default function FileEditor({ initial }: FileEditorProps) {
  return (
    <div className="w-full space-y-3">
      {/* READ-ONLY VIEWER */}
      <div className="w-full min-h-[80vh] md:min-h-[85vh] bg-black border border-neutral-700 rounded-xl p-4 text-white text-sm font-mono leading-6 overflow-auto force-scrollbar">
        <pre className="whitespace-pre-wrap break-all">{initial}</pre>
      </div>
    </div>
  );
}
