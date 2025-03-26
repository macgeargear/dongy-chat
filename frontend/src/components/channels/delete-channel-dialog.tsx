import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "../ui/input";

interface DeleteChannelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  channelName: string;
}

export function DeleteChannelDialog({
  isOpen,
  onClose,
  onConfirm,
  channelName,
}: DeleteChannelDialogProps) {
  const [input, setInput] = useState("");

  const handleDelete = () => {
    onConfirm();
    setInput("");
  };

  const isMatch = input === channelName;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          This action cannot be undone. This will permanently delete the channel{" "}
          <strong>{channelName}</strong>.
        </p>
        <p className="text-sm mt-2">
          Please type <strong>{channelName}</strong> to confirm:
        </p>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={channelName}
        />

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={!isMatch}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
