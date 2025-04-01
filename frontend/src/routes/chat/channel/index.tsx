import { createFileRoute, useRouter } from "@tanstack/react-router";
import CreateChannelDialog, {
  type CreateChannelInput,
} from "@/components/channels/create-channel-dialog";
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
import { Route as ChatRoute } from "../route";

export const Route = createFileRoute("/chat/channel/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { channels } = ChatRoute.useLoaderData();
  const router = useRouter();

  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

  const createChannel = useCreateChannel();
  const updateChannel = useUpdateChannel();

  const handleCreateChannel = async (data: CreateChannelInput) => {
    toast.promise(createChannel.mutateAsync(data), {
      loading: "Creating channel...",
      success: "Channel created successfully!",
      error: "Failed to create channel",
    });
    router.invalidate();
  };

  const handleUpdateChannel = async (data: UpdateChannelInput) => {
    toast.promise(updateChannel.mutateAsync(data), {
      loading: "Updating channel...",
      success: "Channel updated successfully!",
      error: "Failed to update channel",
    });
    router.invalidate();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">📂 All Channels</h1>
        <CreateChannelDialog onSubmit={handleCreateChannel} />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {channels
          ?.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .map((channel) => (
            <ChannelCard
              key={channel.id}
              channel={channel}
              onEdit={() => setSelectedChannel(channel)}
            />
          ))}{" "}
      </div>

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
