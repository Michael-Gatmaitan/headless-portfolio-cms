"use client";

import { useDeleteProjects } from "@/hooks/useProjects";
import { Project } from "@portfolio-types/shared";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
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

const DeleteProjectDialog = ({ project }: { project: Project }) => {
  const [open, setOpen] = useState(false);

  const { mutate: deleteProject, isPending } = useDeleteProjects();

  const handleSubmit = () => {
    deleteProject(project.id);
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="destructive"
          className="flex gap-2"
          disabled={isPending}
        >
          <Trash2 /> Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this project?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            variant="destructive"
          >
            {isPending ? <Spinner /> : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteProjectDialog