import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import {
  EditIcon,
  Loader2Icon,
  LockIcon,
  MessageCircleIcon,
  TrashIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";
import type { Channel } from "@/types";
import { useState } from "react";
import { useDeleteChannel } from "@/hooks/channel/use-delete-channel";
import { DeleteChannelDialog } from "./delete-channel-dialog";
import toast from "react-hot-toast";
import { useChannel } from "@/hooks/channel/use-channel";
import { useAddUserChannel } from "@/hooks/channel/use-add-user-channel";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import { Checkbox } from "../ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useUsers } from "@/hooks/user/use-users";

interface ChannelCardProps {
  channel: Channel;
  onEdit: () => void;
}

export function ChannelCard({ channel, onEdit }: ChannelCardProps) {
  console.log({ channel });
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const deleteChannel = useDeleteChannel();

  const { data: allUsers } = useUsers();

  const addUserChannel = useAddUserChannel();

  const handleDelete = async () => {
    await deleteChannel.mutateAsync(channel.id);
    toast.success("Channel deleted successfully");
    setIsDeleteOpen(false);
  };

  const handleAddUserChannel = async (userId: string) => {
    toast.promise(
      addUserChannel.mutateAsync({
        channelId: channel.id,
        userId,
      }),
      {
        loading: "Adding user to channel...",
        success: "User added to channel successfully",
        error: "Failed to add user to channel",
      },
    );
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-base font-medium line-clamp-1">
                {channel.name}
              </CardTitle>

              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant={channel.isPrivate ? "secondary" : "default"}
                  className="text-xs font-normal"
                >
                  {channel.isPrivate ? (
                    <span className="flex items-center gap-1">
                      <LockIcon className="h-3 w-3" />
                      Private
                    </span>
                  ) : (
                    "Public"
                  )}
                </Badge>
              </div>
            </div>

            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={onEdit}
                className="p-1 text-muted-foreground hover:text-foreground"
              >
                <EditIcon className="h-4 w-4" />
              </Button>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 text-muted-foreground hover:text-foreground"
                  >
                    <UserPlusIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search users..." />
                    <CommandEmpty>No users found.</CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-auto">
                      {allUsers
                        ?.filter(
                          (user) =>
                            !channel.channelMembers
                              .map((member) => member.userId)
                              .includes(user.id),
                        )
                        .map((user) => {
                          return (
                            <CommandItem
                              key={user.id}
                              onSelect={() => handleAddUserChannel(user.id)}
                              className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-muted transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <Avatar className="border border-border shadow-sm w-8 h-8">
                                  <AvatarImage src={user.imageUrl} />
                                  <AvatarFallback>
                                    {user.displayName?.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <p className="text-sm font-medium text-foreground">
                                  {user.displayName}
                                </p>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                Select
                              </span>
                            </CommandItem>
                          );
                        })}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsDeleteOpen(true);
                }}
                className="p-1 text-red-500 hover:bg-red-100"
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="text-sm text-muted-foreground space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <UsersIcon className="h-3 w-3" />
            {channel?.channelMembers?.length} members
          </div>
          <div className="flex items-center gap-2 text-xs">
            <MessageCircleIcon className="h-3 w-3" />
            {channel?.messages?.length} messages
          </div>
        </CardContent>

        <DeleteChannelDialog
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleDelete}
          channelName={channel.name}
        />
      </Card>
      <DeleteChannelDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        channelName={channel.name}
      />
    </>
  );
}
