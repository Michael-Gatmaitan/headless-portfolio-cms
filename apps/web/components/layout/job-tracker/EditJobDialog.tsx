"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EditJobForm } from "./EditJobForm";
import { Job } from "@portfolio-types/shared";
import { ScrollArea } from "@/components/ui/scroll-area";

export const EditJobDialog = ({ job }: { job: Job }) => {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="flex items-center gap-1">
          <Pencil className="h-3.5 w-3.5" /> Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Job Application</DialogTitle>
          <DialogDescription>Update your job application details</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] w-full pr-4 -mr-4 py-1">
          <EditJobForm job={job} setOpen={setOpen} setIsPending={setIsPending} />
        </ScrollArea>

        <DialogFooter className="pt-4 border-t mt-4">
          <DialogClose asChild>
            <Button variant="outline" disabled={isPending}>Cancel</Button>
          </DialogClose>
          <Button type="submit" form={`edit-job-${job.id}`} disabled={isPending}>
            {isPending ? "Updating..." : "Update Application"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
