import AddProjectDialog from "@/components/layout/projects/AddProjectDialog";
import DisplayProjects from "@/components/layout/projects/DisplayProjects";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
};

const page = () => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Update your projects</h1>
        <AddProjectDialog />
      </div>

      <DisplayProjects />
    </div>
  );
};

export default page;
