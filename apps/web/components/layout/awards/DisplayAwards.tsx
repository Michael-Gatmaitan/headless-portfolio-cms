"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import EmptyData from "@/components/EmptyData";
import { Spinner } from "@/components/ui/spinner";
import { useAwards, useReorderAwards } from "@/hooks/useAwards";
import { FolderCodeIcon } from "lucide-react";
import AddAwardDialog from "./AddAwardDialog";
import DraggableAwardCard from "./DraggableAwardCard";
import { buildReorderPayloadFromVisualOrder } from "@/lib/sortOrder";
import { reorderListById } from "@/lib/reorderList";
import type { Award } from "@portfolio-types/shared";

const DisplayAwards = () => {
  const { data: awards, isLoading, isError, error } = useAwards();
  const reorderMutation = useReorderAwards();
  const [orderedAwards, setOrderedAwards] = useState<Award[]>([]);
  const orderedAwardsRef = useRef<Award[]>([]);
  const dragStartIndexRef = useRef<number | null>(null);

  useEffect(() => {
    if (awards) {
      setOrderedAwards(awards);
      orderedAwardsRef.current = awards;
    }
  }, [awards]);

  const moveAward = useCallback((dragIndex: number, hoverIndex: number) => {
    setOrderedAwards((prev) => {
      const next = [...prev];
      const [removed] = next.splice(dragIndex, 1);
      next.splice(hoverIndex, 0, removed!);
      orderedAwardsRef.current = next;
      return next;
    });
  }, []);

  const handleDragStart = useCallback((itemId: string) => {
    dragStartIndexRef.current = orderedAwardsRef.current.findIndex(
      (award) => award.id === itemId,
    );
  }, []);

  const handleDragEnd = useCallback(
    (itemId: string, finalIndex: number) => {
      const fromIndex = dragStartIndexRef.current;
      dragStartIndexRef.current = null;

      if (fromIndex === null || fromIndex === finalIndex || !awards) return;

      const aligned =
        reorderListById(orderedAwardsRef.current, itemId, finalIndex) ??
        orderedAwardsRef.current;

      orderedAwardsRef.current = aligned;
      setOrderedAwards(aligned);

      const payload = buildReorderPayloadFromVisualOrder(aligned);
      reorderMutation.mutate(payload, {
        onError: () => {
          setOrderedAwards(awards);
          orderedAwardsRef.current = awards;
        },
      });
    },
    [awards, reorderMutation],
  );

  if (isError) {
    return <div>Error loading awards: {error?.message}</div>;
  }

  return (
    <div className="mt-4">
      {isLoading && !awards && (
        <div className="flex items-center gap-2 justify-center w-full">
          <Spinner />
          Getting awards...
        </div>
      )}

      {orderedAwards.length > 0 ? (
        <DndProvider backend={HTML5Backend}>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
            {orderedAwards.map((award, index) => (
              <DraggableAwardCard
                key={award.id}
                award={award}
                index={index}
                moveAward={moveAward}
                onDragStart={() => handleDragStart(award.id)}
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
            title="No Awards Added"
            description="You haven't added any awards yet. Get started by adding your first award."
            icon={FolderCodeIcon}
          >
            <AddAwardDialog />
          </EmptyData>
        )
      )}
    </div>
  );
};

export default DisplayAwards;
