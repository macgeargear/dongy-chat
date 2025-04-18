import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { getChannels } from "@/hooks/channel/use-channels";
import { fetchMe } from "@/hooks/use-auth";
import { socket } from "@/lib/socket";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/chat")({
  loader: async () => ({
    user: await fetchMe(),
    channels: await getChannels(),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { user, channels } = Route.useLoaderData();

  useEffect(() => {
    socket.emit("new-user-add", user);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden w-full">
      <ChatSidebar channels={channels} user={user}>
        <main className="flex-1 flex flex-col bg-background">
          <section className="flex-1 overflow-auto">
            <Outlet />
          </section>
        </main>
      </ChatSidebar>
    </div>
  );
}
