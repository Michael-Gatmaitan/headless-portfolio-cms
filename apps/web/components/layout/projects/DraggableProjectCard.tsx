"use client";

import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import type { Project } from "@portfolio-types/shared";
import Image from "next/image";
import Link from "next/link";
import { GripVertical } from "lucide-react";
import EditProjectDialog from "./EditProjectDialog";
import { cn } from "@/lib/utils";
import { shouldSwapOnHover } from "@/lib/dndHover";

export const PROJECT_DRAG_TYPE = "PROJECT";

interface DragItem {
  id: string;
  index: number;
}

interface DraggableProjectCardProps {
  project: Project;
  index: number;
  moveProject: (dragIndex: number, hoverIndex: number) => void;
  onDragStart: () => void;
  onDragEnd: (itemId: string, finalIndex: number) => void;
}

const DraggableProjectCard = ({
  project,
  index,
  moveProject,
  onDragStart,
  onDragEnd,
}: DraggableProjectCardProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean }>({
    accept: PROJECT_DRAG_TYPE,
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
    hover(item, monitor) {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;

      if (
        !shouldSwapOnHover(
          dragIndex,
          hoverIndex,
          ref.current.getBoundingClientRect(),
          clientOffset,
        )
      ) {
        return;
      }

      moveProject(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type: PROJECT_DRAG_TYPE,
    item: (): DragItem => {
      onDragStart();
      return { id: project.id, index };
    },
    end: (item) => {
      if (item) onDragEnd(item.id, item.index);
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  preview(drop(ref));

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border p-4 grid gap-2 transition-shadow",
        isDragging && "opacity-40",
        isOver && "ring-2 ring-primary/40",
      )}
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          ref={(node) => {
            drag(node);
          }}
          className="cursor-grab touch-none text-muted-foreground hover:text-foreground active:cursor-grabbing"
          aria-label={`Drag to reorder ${project.title}`}
        >
          <GripVertical className="size-5" />
        </button>
        <span className="text-xs text-muted-foreground">Drag to reorder</span>
      </div>

      <Link href={`/projects/${project.id}`}>
        <div className="aspect-video w-full flex rounded-md overflow-hidden">
          {project.thumbnail ? (
            <Image
              className="w-full h-full object-cover"
              src={project.thumbnail}
              alt={project.title}
              width={500}
              height={500}
            />
          ) : (
            <div className="flex-1 border p-2 rounded-md flex items-center justify-center">
              No thumbnail
            </div>
          )}
        </div>
      </Link>
      <div className="flex justify-between items-start mt-2">
        <Link
          href={`/projects/${project.id}`}
          className="space-y-1 block flex-1"
        >
          <div className="font-bold text-xl hover:underline">{project.title}</div>
          <div className="font-medium text-gray-600 dark:text-gray-300">
            {project.description}
          </div>
        </Link>

        <EditProjectDialog project={project} />
      </div>
    </div>
  );
};

export default DraggableProjectCard;
