import { socket } from "@/lib/socket";

export function useAdminBroadcast() {
  const announce = (message: string) => {
    socket.emit("admin_announce", message);
  };

  return { announce };
}
