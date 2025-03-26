import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { fetchMe } from "@/hooks/use-auth";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/chat")({
  loader: async () => ({
    user: await fetchMe(),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = Route.useLoaderData();

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden w-full">
        <ChatSidebar />
        <main className="flex-1 flex flex-col bg-background">
          <header className="border-b px-4 py-3 flex items-center gap-2">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold">
              👋🏻 Hello, {user?.displayName}
            </h1>
          </header>
          <section className="flex-1 overflow-auto px-4 py-6">
            <Outlet />
          </section>
        </main>
      </div>
    </SidebarProvider>
  );
}
