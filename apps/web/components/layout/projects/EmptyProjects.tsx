import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { FolderCodeIcon } from "lucide-react";
import AddProjectDialog from "./AddProjectDialog";

const EmptyProjects = () => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderCodeIcon />
        </EmptyMedia>
        <EmptyTitle>No Projects Added</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t added any projects yet. Get started by adding your
          first project information.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <AddProjectDialog />
      </EmptyContent>
    </Empty>
  );
};

export default EmptyProjects;
