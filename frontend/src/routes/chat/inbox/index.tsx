import { createFileRoute, useRouter } from "@tanstack/react-router";
import { type CreateChannelInput } from "@/components/channels/create-channel-dialog";
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
import { InboxIcon } from "lucide-react";
import { UserCard } from "@/components/user/user-card";

export const Route = createFileRoute("/chat/inbox/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { channels, user } = ChatRoute.useLoaderData();
  const router = useRouter();

  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

  const createChannel = useCreateChannel();
  const updateChannel = useUpdateChannel();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <InboxIcon className="size-6" />
        <h1 className="text-xl font-bold">All Inbox</h1>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {channels
          .filter((channel) => channel.isPrivate)
          ?.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .map((channel) => (
            <UserCard key={channel.id} user={user} channel={channel} />
          ))}{" "}
      </div>
    </div>
  );
}
