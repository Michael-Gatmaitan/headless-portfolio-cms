"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { Award } from "@portfolio-types/shared";
import { useState } from "react";
import AddAwardForm from "./AddAwardForm";
import { Pencil, Plus } from "lucide-react";

const AddAwardDialog = ({ award }: { award?: Award }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size={award ? "sm" : "lg"}
          variant={award ? "outline" : "default"}
          className="flex gap-2"
        >
          {award ? <Pencil /> : <Plus />} {award ? "Edit" : "Add"} Award
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{award ? "Edit" : "Add"} Award</DialogTitle>
          <DialogDescription>
            {award ? "Edit" : "Add"} your awards.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] w-full pr-4 -mr-4 py-1">
          <AddAwardForm
            setOpen={setOpen}
            mode={award ? "edit" : "create"}
            defaultValues={award}
          />
        </ScrollArea>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" form="add-award">
            {award ? "Update" : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddAwardDialog;
