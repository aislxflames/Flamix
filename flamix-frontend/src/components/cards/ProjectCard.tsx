import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Play, Pause } from "lucide-react";
import type { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
}

export function ProjectCard({ project, onDelete, onToggle }: ProjectCardProps) {
  const isRunning = project.status === "running";

  return (
    <Card className="w-full max-w-sm shadow-md bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white flex justify-between items-center">
          {project.name}
          <Badge variant={isRunning ? "default" : "secondary"}>
            {isRunning ? "Running" : "Stopped"}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="text-slate-300">
        <p className="text-sm">{project.description}</p>
      </CardContent>

      <CardFooter className="flex justify-between mt-4">
        <Button
          onClick={() => onToggle(project.id)}
          variant="outline"
          size="sm"
          className="text-white border-slate-600"
        >
          {isRunning ? (
            <Pause className="h-4 w-4 mr-1" />
          ) : (
            <Play className="h-4 w-4 mr-1" />
          )}
          {isRunning ? "Stop" : "Start"}
        </Button>

        <Button
          onClick={() => onDelete(project.id)}
          variant="destructive"
          size="sm"
        >
          <Trash2 className="h-4 w-4 mr-1" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
