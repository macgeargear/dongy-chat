import { socket } from "@/lib/socket";
import type { User } from "@/types";
import { useEffect, useState } from "react";

export function useOnlineUsers() {
  const [users] = useState<User[]>([]);

  useEffect(() => {
    socket.emit("");
  }, [users]);
}
