import { UserCard } from "@/components/user/user-card";
import { getUsers } from "@/hooks/user/use-users";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/chat/users/")({
  component: RouteComponent,
  loader: async () => ({
    users: await getUsers(),
  }),
});

function RouteComponent() {
  const { users } = Route.useLoaderData();

  return (
    <main className="min-h-screen bg-background py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-medium mb-2 text-center">Chat Contacts</h1>
        <p className="text-center text-muted-foreground mb-8 text-sm">
          Select a contact to message
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onDirectMessage={() => {}}
              onGroupChat={() => {}}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
