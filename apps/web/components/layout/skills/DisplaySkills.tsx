"use client";

import EmptyData from "@/components/EmptyData";
import { Spinner } from "@/components/ui/spinner";
import { useSkills } from "@/hooks/useSkills";
import { FolderCodeIcon } from "lucide-react";
import AddSkillDialog from "./AddSkillDialog";
import StackIcon from "tech-stack-icons";
import DeleteSkillDialog from "./DeleteSkillDialog";
import { Skill } from "@portfolio-types/shared";

const DisplaySkills = () => {
  const { data: skills, isLoading, isError, error } = useSkills();

  if (isLoading) {
    return <div>Loading skills...</div>;
  }

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

      {skills && skills.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
          {skills.map((skill) => (
            <div className="rounded-lg border p-4" key={skill.id}>
              <div className="flex flex-col gap-2">
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
          ))}
        </div>
      ) : (
        <EmptyData
          title="No Skills Added"
          description="You haven't added any skills yet. Get started by adding your first skill information."
          icon={FolderCodeIcon}
        >
          <AddSkillDialog />
        </EmptyData>
      )}
    </div>
  );
};

const ActionButtons = ({ skill }: { skill: Skill }) => (
  <div className="flex gap-1">
    <AddSkillDialog skill={skill} />
    <DeleteSkillDialog skill={skill} />
  </div>
);

export default DisplaySkills;
