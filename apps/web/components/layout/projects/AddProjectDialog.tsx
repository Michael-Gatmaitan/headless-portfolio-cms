"use client";

import { Button } from "@/components/ui/button";
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
import { Plus } from "lucide-react";
import AddProjectForm from "./AddProjectForm";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

const AddProjectDialog = ({
  variant = "default",
  size = "lg",
}: {
  variant?: "outline" | "default";
  size?: "sm" | "lg";
}) => {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={size} variant={variant} className="flex gap-2">
          <Plus /> Add Project
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Project</DialogTitle>
          <DialogDescription>
            Add a new project to your profile.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] w-full pr-4 -mr-4 py-1">
          <AddProjectForm setOpen={setOpen} setIsPending={setIsPending} />
        </ScrollArea>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isPending}>Cancel</Button>
          </DialogClose>
          <Button type="submit" form="add-project" disabled={isPending}>
            {isPending ? "Creating..." : "Add Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddProjectDialog;
