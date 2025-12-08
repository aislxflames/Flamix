"use client";

import { useEffect, useState, useRef } from "react";
import { socket } from "@/utils/socket";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface LogViewerProps {
  channels: string[];
  defaultChannel?: string;
}

export default function LogViewer({
  channels,
  defaultChannel,
}: LogViewerProps) {
  const [currentChannel, setCurrentChannel] = useState(
    defaultChannel || channels[0],
  );

  // Store logs per channel: { frontend: [...], proxy: [...], etc. }
  const [logs, setLogs] = useState<Record<string, string[]>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when logs update
  useEffect(() => {
    const box = scrollRef.current;
    if (box) box.scrollTop = box.scrollHeight;
  }, [logs, currentChannel]);

  // Socket listener
  useEffect(() => {
    socket.connect();

    // Ask backend for old logs
    socket.emit("subscribe", currentChannel);

    socket.onAny((event, data) => {
      setLogs((prev) => ({
        ...prev,
        [event]: [...(prev[event] || []), data],
      }));
    });

    return () => {
      socket.offAny();
    };
  }, [currentChannel]);

  const clearLogs = () => {
    setLogs((prev) => ({
      ...prev,
      [currentChannel]: [],
    }));
  };

  return (
    <Card className="border-0 bg-transparent">
      <CardContent className="p-4 space-y-4">
        {/* Channel Selector */}
        <Select
          value={currentChannel}
          onValueChange={(v) => setCurrentChannel(v)}
        >
          <SelectTrigger className="w-64 bg-card border border-border text-foreground">
            <SelectValue placeholder="Select a channel" />
          </SelectTrigger>
          <SelectContent>
            {channels.map((ch) => (
              <SelectItem key={ch} value={ch}>
                {ch}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Log Window */}
        <div
          ref={scrollRef}
          className={cn(
            "bg-muted text-muted-foreground p-4 rounded-lg border border-border",
            "h-[65vh] overflow-y-auto font-mono text-sm leading-relaxed shadow-inner",
          )}
        >
          {(logs[currentChannel] || []).map((line, index) => (
            <pre
              key={index}
              className="border-b border-border/40 py-1 whitespace-pre-wrap text-foreground"
            >
              {line}
            </pre>
          ))}
        </div>

        {/* Controls */}
        <div className="flex justify-between">
          <Button variant="secondary" onClick={clearLogs}>
            Clear Logs
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
