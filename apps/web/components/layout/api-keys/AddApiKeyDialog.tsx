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
import { Copy, Plus } from "lucide-react";
import { useState } from "react";
import AddApiKeyForm from "./AddApiKeyForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ApiKeyResponseType } from "@portfolio-types/shared";
import { toast } from "sonner";

const AddApiKeyDialog = () => {
  const [open, setOpen] = useState(false);
  const [apiKeyResponse, setApiKeyResponse] = useState<ApiKeyResponseType>();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="flex items-center gap-2">
          <Plus size={20} />
          <p>Add Key</p>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add API Key</DialogTitle>
          <DialogDescription>
            Add a new API key to your account.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] w-full pr-4 -mr-4 py-1">
          <AddApiKeyForm
            setOpen={setOpen}
            apiKeyResponse={apiKeyResponse}
            setApiKeyResponse={setApiKeyResponse}
          />
        </ScrollArea>

        <DialogFooter>
          {!apiKeyResponse ? (
            <>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" form="add-api-key">
                Add Key
              </Button>
            </>
          ) : (
            <>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(apiKeyResponse.data.key);
                  toast.success("API Key copied successfully");
                }}
              >
                <Copy />
                Copy
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddApiKeyDialog;
