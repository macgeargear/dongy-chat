import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import {
  EditIcon,
  LockIcon,
  MessageCircleIcon,
  TrashIcon,
  UsersIcon,
} from "lucide-react";
import type { Channel } from "@/types";
import { useState } from "react";
import { useDeleteChannel } from "@/hooks/channel/use-delete-channel";
import { DeleteChannelDialog } from "./delete-channel-dialog";

interface ChannelCardProps {
  channel: Channel;
  onEdit: () => void;
}

export function ChannelCard({ channel, onEdit }: ChannelCardProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const deleteChannel = useDeleteChannel();

  const handleDelete = async () => {
    await deleteChannel.mutateAsync(channel.id);
    setIsDeleteOpen(false);
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
                <Badge className="text-xs font-normal flex items-center gap-1">
                  🎨 {channel.theme}
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDeleteOpen(true)}
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
