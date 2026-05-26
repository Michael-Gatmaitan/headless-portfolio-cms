"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useProjects, useReorderProjects } from "@/hooks/useProjects";
import { Spinner } from "@/components/ui/spinner";
import EmptyData from "@/components/EmptyData";
import { FolderCodeIcon } from "lucide-react";
import AddProjectDialog from "./AddProjectDialog";
import DraggableProjectCard from "./DraggableProjectCard";
import { buildReorderPayloadFromVisualOrder } from "@/lib/sortOrder";
import { reorderListById } from "@/lib/reorderList";
import type { Project } from "@portfolio-types/shared";

const DisplayProjects = () => {
  const { data: projects, isLoading, isError, error } = useProjects();
  const reorderMutation = useReorderProjects();
  const [orderedProjects, setOrderedProjects] = useState<Project[]>([]);
  const orderedProjectsRef = useRef<Project[]>([]);
  const dragStartIndexRef = useRef<number | null>(null);

  useEffect(() => {
    if (projects) {
      setOrderedProjects(projects);
      orderedProjectsRef.current = projects;
    }
  }, [projects]);

  const moveProject = useCallback((dragIndex: number, hoverIndex: number) => {
    setOrderedProjects((prev) => {
      const next = [...prev];
      const [removed] = next.splice(dragIndex, 1);
      next.splice(hoverIndex, 0, removed!);
      orderedProjectsRef.current = next;
      return next;
    });
  }, []);

  const handleDragStart = useCallback((itemId: string) => {
    dragStartIndexRef.current = orderedProjectsRef.current.findIndex(
      (project) => project.id === itemId,
    );
  }, []);

  const handleDragEnd = useCallback(
    (itemId: string, finalIndex: number) => {
      const fromIndex = dragStartIndexRef.current;
      dragStartIndexRef.current = null;

      if (fromIndex === null || fromIndex === finalIndex || !projects) return;

      const aligned =
        reorderListById(orderedProjectsRef.current, itemId, finalIndex) ??
        orderedProjectsRef.current;

      orderedProjectsRef.current = aligned;
      setOrderedProjects(aligned);

      const payload = buildReorderPayloadFromVisualOrder(aligned);
      reorderMutation.mutate(payload, {
        onError: () => {
          setOrderedProjects(projects);
          orderedProjectsRef.current = projects;
        },
      });
    },
    [projects, reorderMutation],
  );

  if (isError) {
    return <div>Error loading projects: {error?.message}</div>;
  }

  return (
    <div className="mt-4">
      {isLoading && !projects && (
        <div className="flex items-center gap-2 justify-center w-full">
          <Spinner />
          Getting projects...
        </div>
      )}

      {orderedProjects.length > 0 ? (
        <DndProvider backend={HTML5Backend}>
          <div className="grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-4 gap-2">
            {orderedProjects.map((project, index) => (
              <DraggableProjectCard
                key={project.id}
                project={project}
                index={index}
                moveProject={moveProject}
                onDragStart={() => handleDragStart(project.id)}
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
            title="No Projects Added"
            description="You haven't added any projects yet. Get started by adding your first project information."
            icon={FolderCodeIcon}
          >
            <AddProjectDialog />
          </EmptyData>
        )
      )}
    </div>
  );
};

export default DisplayProjects;
