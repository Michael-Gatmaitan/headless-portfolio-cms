"use client";

import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import type { Skill } from "@portfolio-types/shared";
import { GripVertical } from "lucide-react";
import StackIcon from "tech-stack-icons";
import { cn } from "@/lib/utils";
import { shouldSwapOnHover } from "@/lib/dndHover";
import AddSkillDialog from "./AddSkillDialog";
import DeleteSkillDialog from "./DeleteSkillDialog";
import { Button } from "@/components/ui/button";

export const SKILL_DRAG_TYPE = "SKILL";

interface DragItem {
  id: string;
  index: number;
}

interface DraggableSkillCardProps {
  skill: Skill;
  index: number;
  moveSkill: (dragIndex: number, hoverIndex: number) => void;
  onDragStart: () => void;
  onDragEnd: (itemId: string, finalIndex: number) => void;
}

const ActionButtons = ({ skill }: { skill: Skill }) => (
  <div className="flex gap-1">
    <AddSkillDialog skill={skill} />
    <DeleteSkillDialog skill={skill} />
  </div>
);

const DraggableSkillCard = ({
  skill,
  index,
  moveSkill,
  onDragStart,
  onDragEnd,
}: DraggableSkillCardProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean }>({
    accept: SKILL_DRAG_TYPE,
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

      moveSkill(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type: SKILL_DRAG_TYPE,
    item: (): DragItem => {
      onDragStart();
      return { id: skill.id, index };
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
        "rounded-lg border p-4 transition-shadow",
        isDragging && "opacity-40",
        isOver && "ring-2 ring-primary/40",
      )}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            type="button"
            ref={(node) => {
              drag(node);
            }}
            className="cursor-grab touch-none text-muted-foreground hover:text-foreground active:cursor-grabbing"
            aria-label={`Drag to reorder ${skill.title}`}
          >
            <GripVertical className="size-5" />
          </Button>
          <span className="text-xs text-muted-foreground">Drag to reorder</span>
        </div>

        <div className="flex justify-between items-center w-full">
          <div className="font-bold text-xl">{skill.title}</div>
          <div className="hidden lg:block">
            <ActionButtons skill={skill} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {skill.tags.map((tag) => (
            <div
              key={tag}
              className="flex items-center gap-2 p-2 border rounded-sm"
            >
              <StackIcon name={tag} className="w-5 h-5" />
              <div className="text-sm text-muted-foreground capitalize">
                {tag}
              </div>
            </div>
          ))}
        </div>

        <div className="lg:hidden">
          <ActionButtons skill={skill} />
        </div>
      </div>
    </div>
  );
};

export default DraggableSkillCard;
