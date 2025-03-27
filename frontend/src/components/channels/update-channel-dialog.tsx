import { useState } from "react";
import * as z from "zod";
import { useForm } from "@tanstack/react-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Channel } from "@/types";

const updateChannelSchema = z.object({
  id: z.string().uuid("Invalid channel ID"),
  name: z.string().min(1, "Channel name is required"),
  theme: z.string().min(1, "Channel theme is required"),
});

export type UpdateChannelInput = z.infer<typeof updateChannelSchema>;

interface UpdateChannelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  handleUpdateChannel: (data: UpdateChannelInput) => void;
  channel: Channel;
}

export function UpdateChannelDialog({
  isOpen,
  onClose,
  handleUpdateChannel,
  channel,
}: UpdateChannelDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      id: channel.id,
      name: channel.name,
      theme: channel.theme,
    },
    validators: {
      onSubmit: updateChannelSchema,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      handleUpdateChannel(value);
      setIsSubmitting(false);
      onClose();
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Channel</DialogTitle>
          <DialogDescription>Update the channel details.</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          {/* Channel Name */}
          <form.Field name="name">
            {(field) => (
              <div className="space-y-1">
                <label className="text-sm font-medium">Channel Name</label>
                <Input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Enter channel name"
                />
                {
                  <p className="text-sm text-red-500">
                    {field.state.meta.errors.join(", ")}
                  </p>
                }
              </div>
            )}
          </form.Field>

          {/* Channel Theme */}
          <form.Field name="theme">
            {(field) => (
              <div className="space-y-1">
                <label className="text-sm font-medium">Theme</label>
                <Input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Enter theme"
                />
                {
                  <p className="text-sm text-red-500">
                    {field.state.meta.errors.join(", ")}
                  </p>
                }
              </div>
            )}
          </form.Field>

          {/* Channel Members */}

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit">
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
