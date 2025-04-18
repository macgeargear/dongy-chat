import { createFileRoute, useRouter } from "@tanstack/react-router";
import { InboxIcon } from "lucide-react";
import { UserCard } from "@/components/user/user-card";
import { getUsers } from "@/hooks/user/use-users";
import { getChannels } from "@/hooks/channel/use-channels";
import type { Channel } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import { useMemo } from "react";

export const Route = createFileRoute("/chat/inbox/")({
  loader: async () => {
    const users = await getUsers();
    const channels = await getChannels();
    return { users, channels };
  },
  component: RouteComponent,
});

const useUserChannelMap = (channels: Channel[]) => {
  const { user: currentUser } = useAuth();

  return useMemo(() => {
    const map = new Map<string, string>();

    if (!currentUser) return map;

    for (const channel of channels) {
      if (channel.isPrivate && channel.channelMembers.length === 2) {
        const userIds = channel.channelMembers.map((cm) => cm.userId);

        if (userIds.includes(currentUser.id)) {
          const otherUserId = userIds.find((id) => id !== currentUser.id);
          if (otherUserId) {
            map.set(otherUserId, channel.id);
          }
        }
      }
    }

    return map;
  }, [channels, currentUser?.id]);
};

function RouteComponent() {
  const { users, channels } = Route.useLoaderData();
  const router = useRouter();

  const userChannelMap = useUserChannelMap(channels);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <InboxIcon className="size-6" />
        <h1 className="text-xl font-bold">All Inbox</h1>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((u) => {
          const channelId = userChannelMap.get(u.id);
          return (
            <div
              key={u.id}
              onClick={() =>
                channelId &&
                router.navigate({ to: `/chat/channel/${channelId}` })
              }
            >
              <UserCard user={u} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
