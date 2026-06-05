"use client";

import { columns } from "@/app/(pages)/job-tracker/columns";
import { DataTable } from "@/app/(pages)/job-tracker/data-table";
import EmptyData from "@/components/EmptyData";
import { useJobs, useDeleteJob } from "@/hooks/useJobs";
import { Job } from "@portfolio-types/shared";
import { Briefcase } from "lucide-react";
import { AddJobDialog } from "./AddJobDialog";
import { toast } from "sonner";

export const DisplayJobs = () => {
  const { data: jobs, isLoading, error } = useJobs();
  const deleteMutation = useDeleteJob();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        Loading job applications...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20 text-destructive">
        Error loading job applications: {error.message}
      </div>
    );
  }

  const handleDeleteSelected = async (selectedJobs: Job[]) => {
    try {
      await Promise.all(
        selectedJobs.map((job) => deleteMutation.mutateAsync(job.id))
      );
    } catch {
      toast.error("Failed to delete some job applications");
    }
  };

  return (
    <div className="py-6">
      {jobs && jobs.length > 0 ? (
        <DataTable
          columns={columns}
          data={jobs}
          onDeleteSelected={handleDeleteSelected}
          isDeletingSelected={deleteMutation.isPending}
        />
      ) : (
        <EmptyData
          title="No Job Applications Tracked"
          description="You haven't tracked any job applications yet. Keep your job hunt organized by adding one."
          icon={Briefcase}
        >
          <AddJobDialog />
        </EmptyData>
      )}
    </div>
  );
};
