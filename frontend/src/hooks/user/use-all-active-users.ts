import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import type { User } from "@/types";

export function useAllActiveUsers() {
  const [activeUsers, setActiveUsers] = useState<User[]>([]);

  useEffect(() => {
    const handleActiveUsers = (users: User[]) => {
      setActiveUsers(users);
    };

    socket.on("all_active_users", handleActiveUsers);

    return () => {
      socket.off("all_active_users", handleActiveUsers);
    };
  }, []);

  return { activeUsers };
}
