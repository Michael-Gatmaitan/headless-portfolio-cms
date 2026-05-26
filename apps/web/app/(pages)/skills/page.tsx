import AddSkillDialog from "@/components/layout/skills/AddSkillDialog";
import DisplaySkills from "@/components/layout/skills/DisplaySkills";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Skills",
};

const page = () => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Update your skills</h1>
        <AddSkillDialog />
      </div>

      <DisplaySkills />
    </div>
  );
};

export default page;
