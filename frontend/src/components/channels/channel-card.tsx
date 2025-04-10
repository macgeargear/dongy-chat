import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import {
  DotIcon,
  EditIcon,
  EllipsisIcon,
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
import { useAddUserChannel } from "@/hooks/channel/use-add-user-channel";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useUsers } from "@/hooks/user/use-users";
import { Link, useRouter } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useJoinChannel } from "@/hooks/channel/use-join-channel";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface ChannelCardProps {
  channel: Channel;
  onEdit: () => void;
}

export function ChannelCard({ channel, onEdit }: ChannelCardProps) {
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const deleteChannel = useDeleteChannel();

  const { user } = useAuth();

  const { data: allUsers } = useUsers();

  const addUserChannel = useAddUserChannel();
  const joinChannel = useJoinChannel();

  const handleDelete = async () => {
    await deleteChannel.mutateAsync(channel.id);
    toast.success("Channel deleted successfully");
    setIsDeleteOpen(false);
    router.invalidate();
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

    router.invalidate();
  };

  const handleJoinChannel = async () => {
    toast.promise(
      joinChannel.mutateAsync({
        channelId: channel.id,
        userId: user?.id!,
      }),
      {
        loading: "Joining to channel...",
        success: "Join successfully",
        error: "Failed to join to channel",
      },
    );
  };

  return (
    <>
      <Card
        className={cn("relative hover:shadow-md transition-shadow", {
          "bg-muted":
            user &&
            !channel.channelMembers.map((cm) => cm.userId).includes(user?.id),
        })}
      >
        {user &&
          !channel.channelMembers.map((cm) => cm.userId).includes(user?.id) && (
            <div className="absolute inset-0 backdrop-blur-[2px] bg-background/50 z-10 flex flex-col items-center justify-center">
              <LockIcon className="hover:rotate-45 transition-transform w-8 text-muted-foreground mb-2" />
              <h1 className="text-lg font-bold">{channel.name}</h1>
              <p className="text-xs text-muted-foreground font-medium">
                Not a member
              </p>
              <Button
                size="sm"
                variant="outline"
                className="mt-2 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleJoinChannel();
                }}
              >
                Join Channel
              </Button>
            </div>
          )}
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <Link
                preload="intent"
                key={channel.id}
                to={`/chat/channel/$channelId`}
                params={{ channelId: channel.id }}
                className="hover:no-underline"
              >
                <CardTitle className="text-base font-medium line-clamp-1">
                  {channel.name}
                </CardTitle>
              </Link>
            </div>

            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onEdit();
                }}
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
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
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
            <div className="flex flex items-center -space-x-3">
              {channel.channelMembers.slice(0, 4).map((cm) => {
                const { imageUrl, displayName } = cm.user;
                return (
                  <Tooltip>
                    <TooltipTrigger>
                      <Avatar key={cm.userId} className="border">
                        <AvatarImage src={imageUrl} />
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{displayName}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
              {channel.channelMembers.length > 2 && (
                <Tooltip>
                  <TooltipTrigger>
                    <EllipsisIcon className="bg-white border relative flex size-8 shrink-0 overflow-hidden rounded-full" />
                  </TooltipTrigger>
                  <TooltipContent className="flex flex-col gap-2 p-2">
                    {channel.channelMembers.map((cm) => {
                      const imageUrl = cm.user.imageUrl;
                      return (
                        <div className="flex items-center gap-2">
                          <Avatar key={cm.userId} className="border">
                            <AvatarImage src={imageUrl} />
                          </Avatar>
                          <p>{cm.user.displayName}</p>
                        </div>
                      );
                    })}
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
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
      {/* <JoinChannelDialog
        isOpen={isJoinDialogOpen}
        onClose={() => setIsJoinDialogOpen(false)}
        onConfirm={() => {
          if (user) handleAddUserChannel(user.id);
        }}
        channelName={channel.name}
      />{" "} */}
    </>
  );
}
