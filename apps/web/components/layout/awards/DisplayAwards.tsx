"use client";

import EmptyData from "@/components/EmptyData";
import { Spinner } from "@/components/ui/spinner";
import { useAwards } from "@/hooks/useAwards";
import { Award } from "@portfolio-types/shared";
import { FolderCodeIcon } from "lucide-react";
import React from "react";
import AddAwardDialog from "./AddAwardDialog";
import DeleteAwardDialog from "./DeleteAwardDialog";
import { Badge } from "@/components/ui/badge";

const DisplayAwards = () => {
  const { data: awards, isLoading, isError, error } = useAwards();

  if (isLoading) {
    return <div>Loading skills...</div>;
  }

  if (isError) {
    return <div>Error loading skills: {error?.message}</div>;
  }

  return (
    <div className="mt-4">
      {isLoading && !awards && (
        <div className="flex items-center gap-2 justify-center w-full">
          <Spinner />
          Getting awards...
        </div>
      )}

      {awards && awards.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
          {awards.map((award) => (
            <AwardCard key={award.id} award={award} />
          ))}
        </div>
      ) : (
        <EmptyData
          title="No Skills Added"
          description="You haven't added any skills yet. Get started by adding your first skill information."
          icon={FolderCodeIcon}
        >
          <AddAwardDialog />
        </EmptyData>
      )}
    </div>
  );
};

const AwardCard = ({ award }: { award: Award }) => {
  return (
    <div className="rounded-lg border p-4 space-y-2">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-lg">{award.title}</h3>
        </div>
        <p className="text-muted-foreground text-sm">
          {award.shortDescription}
        </p>
        <p className="text-muted-foreground text-sm">{award.year}</p>

        <div className="flex flex-wrap justify-start gap-1">
          {award.tags.map((tag) => (
            <Badge key={`${award.id}-${tag}`} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-1">
        <AddAwardDialog award={award} />
        <DeleteAwardDialog award={award} />
      </div>
    </div>
  );
};

export default DisplayAwards;
