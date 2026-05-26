"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import EmptyData from "@/components/EmptyData";
import { Spinner } from "@/components/ui/spinner";
import { useSkills, useReorderSkills } from "@/hooks/useSkills";
import { FolderCodeIcon } from "lucide-react";
import AddSkillDialog from "./AddSkillDialog";
import DraggableSkillCard from "./DraggableSkillCard";
import { buildReorderPayloadFromVisualOrder } from "@/lib/sortOrder";
import { reorderListById } from "@/lib/reorderList";
import type { Skill } from "@portfolio-types/shared";

const DisplaySkills = () => {
  const { data: skills, isLoading, isError, error } = useSkills();
  const reorderMutation = useReorderSkills();
  const [orderedSkills, setOrderedSkills] = useState<Skill[]>([]);
  const orderedSkillsRef = useRef<Skill[]>([]);
  const dragStartIndexRef = useRef<number | null>(null);

  useEffect(() => {
    if (skills) {
      setOrderedSkills(skills);
      orderedSkillsRef.current = skills;
    }
  }, [skills]);

  const moveSkill = useCallback((dragIndex: number, hoverIndex: number) => {
    setOrderedSkills((prev) => {
      const next = [...prev];
      const [removed] = next.splice(dragIndex, 1);
      next.splice(hoverIndex, 0, removed!);
      orderedSkillsRef.current = next;
      return next;
    });
  }, []);

  const handleDragStart = useCallback((itemId: string) => {
    dragStartIndexRef.current = orderedSkillsRef.current.findIndex(
      (skill) => skill.id === itemId,
    );
  }, []);

  const handleDragEnd = useCallback(
    (itemId: string, finalIndex: number) => {
      const fromIndex = dragStartIndexRef.current;
      dragStartIndexRef.current = null;

      if (fromIndex === null || fromIndex === finalIndex || !skills) return;

      const aligned =
        reorderListById(orderedSkillsRef.current, itemId, finalIndex) ??
        orderedSkillsRef.current;

      orderedSkillsRef.current = aligned;
      setOrderedSkills(aligned);

      const payload = buildReorderPayloadFromVisualOrder(aligned);
      reorderMutation.mutate(payload, {
        onError: () => {
          setOrderedSkills(skills);
          orderedSkillsRef.current = skills;
        },
      });
    },
    [skills, reorderMutation],
  );

  if (isError) {
    return <div>Error loading skills: {error?.message}</div>;
  }

  return (
    <div className="mt-4">
      {isLoading && !skills && (
        <div className="flex items-center gap-2 justify-center w-full">
          <Spinner />
          Getting skills...
        </div>
      )}

      {orderedSkills.length > 0 ? (
        <DndProvider backend={HTML5Backend}>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
            {orderedSkills.map((skill, index) => (
              <DraggableSkillCard
                key={skill.id}
                skill={skill}
                index={index}
                moveSkill={moveSkill}
                onDragStart={() => handleDragStart(skill.id)}
                onDragEnd={handleDragEnd}
              />
            ))}
          </div>
          {reorderMutation.isPending && (
            <p className="mt-2 text-sm text-muted-foreground">Saving order...</p>
          )}
        </DndProvider>
      ) : (
        !isLoading && (
          <EmptyData
            title="No Skills Added"
            description="You haven't added any skills yet. Get started by adding your first skill information."
            icon={FolderCodeIcon}
          >
            <AddSkillDialog />
          </EmptyData>
        )
      )}
    </div>
  );
};

export default DisplaySkills;
