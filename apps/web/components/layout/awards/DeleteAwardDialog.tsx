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
import { Spinner } from "@/components/ui/spinner";
import { useDeleteAward } from "@/hooks/useAwards";
import { Award } from "@portfolio-types/shared";
import { Trash2 } from "lucide-react";
import { useState } from "react";

const DeleteAwardDialog = ({ award }: { award: Award }) => {
  const [open, setOpen] = useState(false);

  const { mutate: deleteAward, isPending } = useDeleteAward();

  const handleSubmit = () => {
    deleteAward(award.id);
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
          <DialogTitle>Delete Award</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this award?
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
  );
};

export default DeleteAwardDialog;
