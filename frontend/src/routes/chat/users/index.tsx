import { UserCard } from "@/components/user/user-card";
import { UserCardSkeleton } from "@/components/user/user-card-skeleton";
import { fetchMe } from "@/hooks/use-auth";
import { useUsers } from "@/hooks/user/use-users";
import { socket } from "@/lib/socket";
import type { User } from "@/types";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/chat/users/")({
  loader: async () => {
    const user = await fetchMe();
    return { user };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { data: users, isLoading } = useUsers();
  // const { activeUsers } = useAllActiveUsers();
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);

  const handleGetOnlineUsers = (users: any) => {
    setOnlineUsers(users.map((u: any) => u.user));
  };

  useEffect(() => {
    socket.emit("get-users-request");
    socket.on("get-users", handleGetOnlineUsers);

    return () => {
      socket.off("get-users", handleGetOnlineUsers);
    };
  }, []);

  if (isLoading) {
    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, index) => (
            <UserCardSkeleton key={index} />
          ))}
        </div>
      </>
    );
  }

  return (
    <main className="min-h-screen bg-background py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-medium mb-8 text-center">All Users</h1>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, index) => (
              <UserCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {users?.map((user) => (
              <UserCard key={user.id} user={user} onlineUsers={onlineUsers} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
