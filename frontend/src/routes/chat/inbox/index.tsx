import { createFileRoute, useRouter } from "@tanstack/react-router";

// import { Route as ChatRoute } from "../route";
import { InboxIcon } from "lucide-react";
import { UserCard } from "@/components/user/user-card";
import { getUsers } from "@/hooks/user/use-users";
import { getChannels } from "@/hooks/channel/use-channels";
import type { Channel } from "@/types";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/chat/inbox/")({
  loader: async () => {
    const users = await getUsers();
    const channels = await getChannels();
    return { users, channels };
  },
  component: RouteComponent,
});

function RouteComponent() {
  // const { channels, user } = ChatRoute.useLoaderData();
  const { users, channels } = Route.useLoaderData();
  const router = useRouter();
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <InboxIcon className="size-6" />
        <h1 className="text-xl font-bold">All Inbox</h1>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((u) => {
          const isMember = (channel: Channel, m1: string, m2: string) => {
            let n = 0;
            for (let c of channel.channelMembers) {
              if (c.userId === m1 || c.userId === m2) {
                n++;
              }
            }
            return n === 2;
          };

          const channelId = channels.find(
            (channel) =>
              channel.isPrivate && isMember(channel, u.id, user?.id ?? "")
          )?.id;

          return (
            <div
              key={u.id}
              onClick={() =>
                channelId !== undefined &&
                router.navigate({ to: `/chat/channel/${channelId}` })
              }
            >
              <UserCard user={u} />
            </div>
          );
        })}

        {/* {channels
          .filter(
            (channel) =>
              channel.isPrivate &&
              channel.channelMembers
                .map((member) => member.userId)
                .includes(user.id),
          )
          ?.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .map((channel) =>
            channel.channelMembers.map((user) => (
              <UserCard key={channel.id} user={user.user} channel={channel} />
            )),
          )} */}
      </div>
    </div>
  );
}
