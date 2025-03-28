import { UserCard } from "@/components/user/user-card";
import { UserCardSkeleton } from "@/components/user/user-card-skeleton";
import { useUsers } from "@/hooks/user/use-users";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/chat/users/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: users, isLoading } = useUsers();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, index) => (
          <UserCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-medium mb-2 text-center">Chat Contacts</h1>
        <p className="text-center text-muted-foreground mb-8 text-sm">
          Select a contact to message
        </p>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, index) => (
              <UserCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {users?.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onDirectMessage={() => {}}
                onGroupChat={() => {}}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
