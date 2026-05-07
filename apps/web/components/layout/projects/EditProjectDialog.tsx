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
import EditProjectForm from "./EditProjectForm";
import { Project } from "@portfolio-types/shared";
import { ScrollArea } from "@/components/ui/scroll-area";

const EditProjectDialog = ({ project }: { project: Project }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Pencil /> Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>Update your project information</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] w-full pr-4 -mr-4 py-1">
          <EditProjectForm project={project} setOpen={setOpen} />
        </ScrollArea>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" form="edit-project">
            Update Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProjectDialog;
