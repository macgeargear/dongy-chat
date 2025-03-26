import { createFileRoute, Link } from "@tanstack/react-router";
import CreateChannelDialog, {
  type CreateChannelInput,
} from "@/components/channels/create-channel-dialog";
import { getChannels } from "@/hooks/channel/use-channels";
import { useCreateChannel } from "@/hooks/channel/use-create-channel";
import { ChannelCard } from "@/components/channels/channel-card";
import { useUpdateChannel } from "@/hooks/channel/use-update-channel";
import {
  UpdateChannelDialog,
  type UpdateChannelInput,
} from "@/components/channels/update-channel-dialog";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/chat/channel/")({
  component: RouteComponent,
  loader: async () => ({
    channels: await getChannels({
      includeMembers: true,
      includeMessages: true,
    }),
  }),
});

function RouteComponent() {
  const { channels } = Route.useLoaderData();

  const [selectedChannel, setSelectedChannel] =
    useState<UpdateChannelInput | null>(null);

  const createChannel = useCreateChannel();
  const updateChannel = useUpdateChannel();

  const handleCreateChannel = (data: CreateChannelInput) => {
    createChannel.mutate(data);
  };

  const handleUpdateChannel = (data: UpdateChannelInput) => {
    updateChannel.mutate(data);
  };

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
            <ChannelCard
              channel={channel}
              onEdit={() =>
                setSelectedChannel({
                  id: channel.id,
                  name: channel.name,
                  theme: channel.theme,
                })
              }
            />
          </Link>
        ))}
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
