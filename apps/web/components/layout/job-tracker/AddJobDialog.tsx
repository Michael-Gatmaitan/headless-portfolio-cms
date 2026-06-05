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
import { AddJobForm } from "./AddJobForm";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

export const AddJobDialog = ({
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
          <Plus className="h-4 w-4" /> Add Job Application
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Job Application</DialogTitle>
          <DialogDescription>
            Keep track of where you've applied and the current status.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] w-full pr-4 -mr-4 py-1">
          <AddJobForm setOpen={setOpen} setIsPending={setIsPending} />
        </ScrollArea>

        <DialogFooter className="pt-4 border-t mt-4">
          <DialogClose asChild>
            <Button variant="outline" disabled={isPending}>Cancel</Button>
          </DialogClose>
          <Button type="submit" form="add-job" disabled={isPending}>
            {isPending ? "Adding..." : "Add Application"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
