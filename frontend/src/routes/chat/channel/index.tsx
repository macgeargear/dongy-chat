import { createFileRoute, Link } from "@tanstack/react-router";
import CreateChannelDialog, {
  type CreateChannelInput,
} from "@/components/channels/create-channel-dialog";
import { useChannels } from "@/hooks/channel/use-channels";
import { useCreateChannel } from "@/hooks/channel/use-create-channel";
import { ChannelCard } from "@/components/channels/channel-card";
import { useUpdateChannel } from "@/hooks/channel/use-update-channel";
import {
  UpdateChannelDialog,
  type UpdateChannelInput,
} from "@/components/channels/update-channel-dialog";
import { useState } from "react";
import type { Channel } from "@/types";
import toast from "react-hot-toast";
import { ChannelCardSkeleton } from "@/components/channels/channel-card-skeleton";

export const Route = createFileRoute("/chat/channel/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: channels, isLoading } = useChannels({
    includeMembers: true,
    includeMessages: true,
  });
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

  const createChannel = useCreateChannel();
  const updateChannel = useUpdateChannel();

  const handleCreateChannel = async (data: CreateChannelInput) => {
    toast.promise(createChannel.mutateAsync(data), {
      loading: "Creating channel...",
      success: "Channel created successfully!",
      error: "Failed to create channel",
    });
  };

  const handleUpdateChannel = async (data: UpdateChannelInput) => {
    toast.promise(updateChannel.mutateAsync(data), {
      loading: "Updating channel...",
      success: "Channel updated successfully!",
      error: "Failed to update channel",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">📂 All Channels</h1>
        <CreateChannelDialog onSubmit={handleCreateChannel} />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ChannelCardSkeleton />
          <ChannelCardSkeleton />
          <ChannelCardSkeleton />
          <ChannelCardSkeleton />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {channels?.map((channel) => (
            <Link
              key={channel.id}
              to={`/chat/$channelId`}
              params={{ channelId: channel.id }}
              className="hover:no-underline"
            >
              <ChannelCard
                channel={channel}
                onEdit={() => setSelectedChannel(channel)}
              />
            </Link>
          ))}
        </div>
      )}

      {selectedChannel && (
        <UpdateChannelDialog
          isOpen={!!selectedChannel}
          onClose={() => setSelectedChannel(null)}
          channel={selectedChannel}
          handleUpdateChannel={handleUpdateChannel}
        />
      )}
    </div>
  );
}
