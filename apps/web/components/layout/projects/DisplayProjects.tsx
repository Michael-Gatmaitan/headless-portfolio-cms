"use client";

import { useProjects } from "@/hooks/useProjects";
import EmptyProjects from "./EmptyProjects";
import Image from "next/image";
import EditProjectDialog from "./EditProjectDialog";
import Link from "next/link";

const DisplayProjects = () => {
  const { data: projects, isLoading, isError, error } = useProjects();

  if (isLoading) {
    return <div>Loading projects...</div>;
  }

  if (isError) {
    return <div>Error loading projects: {error?.message}</div>;
  }

  return (
    <div className="mt-4">
      {projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-4 gap-2">
          {projects.map((project) => (
            <div key={project.id}>
              <div className="rounded-lg border p-4 grid gap-2">
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
                    <div className="font-bold text-xl hover:underline">
                      {project.title}
                    </div>
                    <div className="font-medium text-gray-600 dark:text-gray-300">
                      {project.description}
                    </div>
                  </Link>

                  <EditProjectDialog project={project} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyProjects />
      )}
    </div>
  );
};

export default DisplayProjects;
