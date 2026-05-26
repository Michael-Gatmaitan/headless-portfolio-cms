"use client";

import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import type { Award } from "@portfolio-types/shared";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { shouldSwapOnHover } from "@/lib/dndHover";
import { Badge } from "@/components/ui/badge";
import AddAwardDialog from "./AddAwardDialog";
import DeleteAwardDialog from "./DeleteAwardDialog";

export const AWARD_DRAG_TYPE = "AWARD";

interface DragItem {
  id: string;
  index: number;
}

interface DraggableAwardCardProps {
  award: Award;
  index: number;
  moveAward: (dragIndex: number, hoverIndex: number) => void;
  onDragStart: () => void;
  onDragEnd: (itemId: string, finalIndex: number) => void;
}

const ActionButtons = ({ award }: { award: Award }) => (
  <div className="flex items-center gap-1">
    <AddAwardDialog award={award} />
    <DeleteAwardDialog award={award} />
  </div>
);

const DraggableAwardCard = ({
  award,
  index,
  moveAward,
  onDragStart,
  onDragEnd,
}: DraggableAwardCardProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean }>({
    accept: AWARD_DRAG_TYPE,
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

      moveAward(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type: AWARD_DRAG_TYPE,
    item: (): DragItem => {
      onDragStart();
      return { id: award.id, index };
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
        "rounded-lg border p-4 space-y-2 transition-shadow",
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
          aria-label={`Drag to reorder ${award.title}`}
        >
          <GripVertical className="size-5" />
        </button>
        <span className="text-xs text-muted-foreground">Drag to reorder</span>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-lg">{award.title}</h3>
        </div>
        <p className="text-muted-foreground text-sm">{award.shortDescription}</p>
        <p className="text-muted-foreground text-sm">{award.year}</p>

        <div className="flex flex-wrap justify-start gap-1">
          {award.tags.map((tag) => (
            <Badge key={`${award.id}-${tag}`} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <ActionButtons award={award} />
    </div>
  );
};

export default DraggableAwardCard;
