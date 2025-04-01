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
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useQueryClient } from "@tanstack/react-query";
import type { User } from "@/types";

const schema = z.object({
  name: z.string(),
  isPrivate: z.boolean(),
  userIds: z
    .array(z.string().uuid())
    .min(1, "At least one user must be selected"),
});

export type CreateChannelInput = z.infer<typeof schema>;

interface CreateChannelDialogProps {
  user: User;
  isPrivate: boolean;
  onSubmit: (input: CreateChannelInput) => void;
  trigger?: React.ReactNode;
}

export default function CreateChannelDialog({
  user,
  isPrivate,
  onSubmit,
  trigger,
}: CreateChannelDialogProps) {
  const [open, setOpen] = useState(false);
  const { data: users, isLoading } = useUsers();

  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      name: "",
      isPrivate,
      userIds: [user.id] as string[],
    },
    validators: {
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      onSubmit(value);
      queryClient.invalidateQueries({ queryKey: ["channels"] });
      setOpen(false);
      form.reset();
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button className="ml-auto">+ Create Channel</Button>
        )}
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
          {!isPrivate && (
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
          )}

          {/* <form.Field name="isPrivate">
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
          </form.Field> */}

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
                        className="w-full justify-between truncate h-fit"
                      >
                        {field.state.value.length > 0 ? (
                          <div className="flex gap-2 flex-wrap max-w-[90%] truncate">
                            {users
                              ?.filter((u) => field.state.value.includes(u.id))
                              .map((u) => (
                                <div
                                  key={u.id}
                                  className="flex items-center text-xs bg-muted px-2 py-0.5 rounded-md"
                                >
                                  <div className="flex items-center gap-2">
                                    <Avatar className="border border-border shadow-xs">
                                      <AvatarImage src={u.imageUrl} />
                                      <AvatarFallback>
                                        {u.displayName[0]}
                                      </AvatarFallback>
                                    </Avatar>
                                    <p>{u.displayName}</p>
                                  </div>
                                </div>
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
                                  <Avatar className="border border-border shadow-xs">
                                    <AvatarImage src={user.imageUrl} />
                                    <AvatarFallback>
                                      {user.displayName[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <p>{user.displayName}</p>
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
