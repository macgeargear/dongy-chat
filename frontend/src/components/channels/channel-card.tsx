import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChannelMember, Message } from "@/types";
import { LockIcon, MessageCircleIcon, UsersIcon } from "lucide-react";

interface ChannelCardProps {
  channel: {
    name: string;
    isPrivate: boolean;
    channelMembers?: ChannelMember[];
    messages?: Message[];
  };
}

export function ChannelCard({ channel }: ChannelCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">{channel.name}</CardTitle>
        <Badge
          variant={channel.isPrivate ? "secondary" : "default"}
          className="text-xs"
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
    </Card>
  );
}
