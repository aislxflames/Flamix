"use client";

import { Button } from "@/components/ui/button";
import { easeOut, motion } from "motion/react";
import * as React from "react";

const randomLogos = [
  "https://placehold.co/200/blue/white?text=F",
  "https://placehold.co/200/red/white?text=P",
  "https://placehold.co/200/green/white?text=A",
  "https://placehold.co/200/purple/white?text=X",
];

export interface ProjectData {
  _id: string;
  projectName: string;
  containers: any[];
  createdAt: string;
  updatedAt: string;
}

interface FlipCardProps {
  data: ProjectData;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
}

export function FlipCardProject({ data, onOpen, onDelete }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = React.useState(false);

  const isTouchDevice =
    typeof window !== "undefined" && "ontouchstart" in window;

  const handleClick = () => {
    if (isTouchDevice) setIsFlipped(!isFlipped);
  };

  const handleMouseEnter = () => {
    if (!isTouchDevice) setIsFlipped(true);
  };

  const handleMouseLeave = () => {
    if (!isTouchDevice) setIsFlipped(false);
  };

  const cardVariants = {
    front: { rotateY: 0, transition: { duration: 0.5, ease: easeOut } },
    back: { rotateY: 180, transition: { duration: 0.5, ease: easeOut } },
  };

  const logo = randomLogos[Math.floor(Math.random() * randomLogos.length)];

  return (
    <div
      className="mt-2 relative w-40 h-60 md:w-60 md:h-80 perspective-1000 cursor-pointer mx-auto"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* FRONT */}
      <motion.div
        className="absolute inset-0 backface-hidden rounded-md border-2 border-foreground/20 px-4 py-6 flex flex-col items-center justify-center bg-gradient-to-br from-muted via-background to-muted text-center"
        animate={isFlipped ? "back" : "front"}
        variants={cardVariants}
        style={{ transformStyle: "preserve-3d" }}
      >
        <img
          src={logo}
          alt="Project Logo"
          className="size-20 md:size-24 rounded-md object-cover mb-4 border-2"
        />
        <h2 className="text-lg font-bold text-foreground">
          {data.projectName}
        </h2>
        <p className="text-sm text-muted-foreground">
          {data.containers.length} containers
        </p>
      </motion.div>

      {/* BACK */}
      <motion.div
        className="absolute inset-0 backface-hidden rounded-md border-2 border-foreground/20 px-4 py-6 flex flex-col justify-between items-center gap-y-4 bg-gradient-to-tr from-muted via-background to-muted"
        initial={{ rotateY: 180 }}
        animate={isFlipped ? "front" : "back"}
        variants={cardVariants}
        style={{ transformStyle: "preserve-3d", rotateY: 180 }}
      >
        <div className="text-center text-xs md:text-sm text-muted-foreground">
          <p>Created: {new Date(data.createdAt).toLocaleDateString()}</p>
          <p>Updated: {new Date(data.updatedAt).toLocaleDateString()}</p>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={() => onOpen(data._id)}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Open
          </Button>

          <Button
            onClick={() => onDelete(data._id)}
            className="bg-red-500 hover:bg-red-600"
          >
            Delete
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
