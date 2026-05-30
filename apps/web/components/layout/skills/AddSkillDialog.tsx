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
import { Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import AddSkillForm from "./AddSkillForm";
import { Skill } from "@portfolio-types/shared";

const AddSkillDialog = ({
  skill,
  variant = "default",
  size = "lg",
}: {
  skill?: Skill;
  variant?: "outline" | "default";
  size?: "sm" | "lg";
}) => {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size={skill ? "sm" : size ? size : "lg"}
          variant={skill ? "outline" : variant ? variant : "default"}
          className="flex gap-2"
        >
          {skill ? <Pencil /> : <Plus />} {skill ? "Edit" : "Add"} Skill
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{skill ? "Edit" : "Add"} Skill</DialogTitle>
          <DialogDescription>
            {skill ? "Edit" : "Add"} your skills.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] w-full pr-4 -mr-4 py-1">
          <AddSkillForm
            setOpen={setOpen}
            mode={skill ? "edit" : "create"}
            defaultValues={skill}
            setIsPending={setIsPending}
          />
        </ScrollArea>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isPending}>Cancel</Button>
          </DialogClose>
          <Button type="submit" form="add-skill" disabled={isPending}>
            {isPending ? "Saving..." : (skill ? "Update" : "Add")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddSkillDialog;
