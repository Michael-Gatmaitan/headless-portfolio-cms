import AddSkillDialog from "@/components/layout/skills/AddSkillDialog";
import DisplaySkills from "@/components/layout/skills/DisplaySkills";

const page = () => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Update your skills</h1>
        <AddSkillDialog />
      </div>

      {/* Display skills */}
      <DisplaySkills />
    </div>
  );
};

export default page;
