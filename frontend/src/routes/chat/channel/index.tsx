import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader2Icon } from "lucide-react";
import CreateChannelDialog, {
  type CreateChannelInput,
} from "@/components/channels/create-channel-dialog";
import { useChannels } from "@/hooks/channel/use-channels";
import { useCreateChannel } from "@/hooks/channel/use-create-channel";
import { ChannelCard } from "@/components/channels/channel-card";

export const Route = createFileRoute("/chat/channel/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: channels, isLoading } = useChannels({
    includeMembers: true,
    includeMessages: true,
  });
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
            <ChannelCard channel={channel} />
          </Link>
        ))}
      </div>
    </div>
  );
}
