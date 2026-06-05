import { AddJobDialog } from "@/components/layout/job-tracker/AddJobDialog";
import { DisplayJobs } from "@/components/layout/job-tracker/DisplayJobs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Job Tracker",
};

const Page = () => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Track your job applications</h1>
        <AddJobDialog />
      </div>

      <DisplayJobs />
    </div>
  );
};

export default Page;
