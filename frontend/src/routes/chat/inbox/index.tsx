import { createFileRoute } from "@tanstack/react-router";

import { Route as ChatRoute } from "../route";
import { InboxIcon } from "lucide-react";
import { UserCard } from "@/components/user/user-card";

export const Route = createFileRoute("/chat/inbox/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { channels, user } = ChatRoute.useLoaderData();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <InboxIcon className="size-6" />
        <h1 className="text-xl font-bold">All Inbox</h1>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {channels
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
          .map((channel) => (
            <UserCard key={channel.id} user={user} channel={channel} />
          ))}{" "}
      </div>
    </div>
  );
}
