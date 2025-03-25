import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockChannels } from "@/lib/mocks";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Loader2Icon,
  LockIcon,
  MessageCircleIcon,
  UsersIcon,
} from "lucide-react";
import CreateChannelDialog, {
  type CreateChannelInput,
} from "@/components/channels/create-channel-dialog";
import { useChannels } from "@/hooks/channel/use-channels";
import { useCreateChannel } from "@/hooks/channel/use-create-channel";

export const Route = createFileRoute("/chat/channel/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: channels, isLoading } = useChannels({
    includeMembers: true,
    includeMessages: true,
  });
  console.log({ channels });
  const createChannel = useCreateChannel();

  const handleCreateChannel = (data: CreateChannelInput) => {
    createChannel.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2Icon className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">📂 All Channels</h1>
        <CreateChannelDialog onSubmit={handleCreateChannel} />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {channels?.map((channel) => (
          <Link
            key={channel.id}
            to="/chat/channel"
            className="hover:no-underline"
          >
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
                  {channel.channelMembers.length} members
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <MessageCircleIcon className="h-3 w-3" />
                  {channel.messages.length} messages
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
