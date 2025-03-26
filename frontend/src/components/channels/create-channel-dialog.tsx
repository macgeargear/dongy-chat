import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useUsers } from "@/hooks/user/use-users";
import { mockUsers } from "@/lib/mocks";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import { Loader2Icon } from "lucide-react";

const schema = z.object({
  name: z.string().min(3, "Channel name must be at least 3 characters long"),
  isPrivate: z.boolean(),
  userIds: z
    .array(z.string().uuid())
    .min(1, "At least one user must be selected"),
});

export type CreateChannelInput = z.infer<typeof schema>;

interface CreateChannelDialogProps {
  onSubmit: (input: CreateChannelInput) => void;
}

export default function CreateChannelDialog({
  onSubmit,
}: CreateChannelDialogProps) {
  const [open, setOpen] = useState(false);
  const { data: users = mockUsers, isLoading } = useUsers();

  const form = useForm({
    defaultValues: {
      name: "",
      isPrivate: false,
      userIds: [] as string[],
    },
    validators: {
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      onSubmit(value);
      setOpen(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="ml-auto">+ Create Channel</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Channel</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field name="name">
            {(field) => (
              <div>
                <Input
                  placeholder="Channel name"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors && (
                  <p className="text-sm text-red-500">
                    {field.state.meta.errors.join(", ")}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="isPrivate">
            {(field) => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is-private"
                  checked={field.state.value}
                  onCheckedChange={(checked) =>
                    field.handleChange(checked === true)
                  }
                />
                <Label htmlFor="is-private" className="text-sm">
                  Private channel
                </Label>
              </div>
            )}
          </form.Field>

          {isLoading ? (
            <div className="h-fit flex justify-center items-center">
              <Loader2Icon className="animate-spin" />
            </div>
          ) : (
            <form.Field name="userIds">
              {(field) => (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Add members</Label>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between truncate"
                      >
                        {field.state.value.length > 0 ? (
                          <div className="flex gap-2 flex-wrap max-w-[90%] truncate">
                            {users
                              ?.filter((u) => field.state.value.includes(u.id))
                              .map((u) => (
                                <span
                                  key={u.id}
                                  className="text-xs bg-muted px-2 py-0.5 rounded-md"
                                >
                                  {u.displayName}
                                </span>
                              ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">
                            Select users
                          </span>
                        )}
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search users..." />
                        <CommandEmpty>No users found.</CommandEmpty>
                        <CommandGroup className="max-h-64 overflow-auto">
                          {users?.map((user) => {
                            const isChecked = field.state.value.includes(
                              user.id,
                            );
                            return (
                              <CommandItem
                                key={user.id}
                                onSelect={() => {
                                  const updated = isChecked
                                    ? field.state.value.filter(
                                        (id) => id !== user.id,
                                      )
                                    : [...field.state.value, user.id];
                                  field.handleChange(updated);
                                }}
                                className="flex items-center justify-between"
                              >
                                <div className="flex items-center gap-2">
                                  <Checkbox checked={isChecked} className="" />
                                  <span>{user.displayName}</span>
                                </div>
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  {field.state.meta.errors && (
                    <p className="text-sm text-red-500">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  )}
                </div>
              )}
            </form.Field>
          )}

          <Button type="submit" className="w-full">
            Create
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
