
import AddAwardDialog from "@/components/layout/awards/AddAwardDialog";
import DashboardStats from "@/components/layout/dashboard/DashboardStats";
import AddProjectDialog from "@/components/layout/projects/AddProjectDialog";
import AddSkillDialog from "@/components/layout/skills/AddSkillDialog";

const page = () => {

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Your dashboard</h1>

        <div className="hidden lg:flex gap-2">
          <AddProjectDialog variant="outline" size="sm" />
          <AddSkillDialog variant="outline" size="sm" />
          <AddAwardDialog variant="outline" size="sm" />
        </div>
      </div>

      <DashboardStats />
    </div>
  );
};

export default page;
