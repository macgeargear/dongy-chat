import { createFileRoute } from "@tanstack/react-router";

// import { Route as ChatRoute } from "../route";
import { InboxIcon } from "lucide-react";
import { UserCard } from "@/components/user/user-card";
import { getUsers } from "@/hooks/user/use-users";

export const Route = createFileRoute("/chat/inbox/")({
  loader: async () => {
    const users = await getUsers();
    return { users };
  },
  component: RouteComponent,
});

function RouteComponent() {
  // const { channels, user } = ChatRoute.useLoaderData();
  const { users } = Route.useLoaderData();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <InboxIcon className="size-6" />
        <h1 className="text-xl font-bold">All Inbox</h1>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
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
