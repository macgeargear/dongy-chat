import { socket } from "@/lib/socket";
import { useEffect } from "react";

export function useTyping(
  channelId: string,
  onTyping: (user: string) => void,
  onStop: (user: string) => void,
) {
  useEffect(() => {
    socket.on("typing", ({ username }) => onTyping(username));
    socket.on("stop_typing", ({ username }) => onStop(username));

    return () => {
      socket.off("typing", onTyping);
      socket.off("stop_typing", onStop);
    };
  }, [channelId, onTyping, onStop]);

  const typing = () => socket.emit("typing", channelId);
  const stopTyping = () => socket.emit("stop_typing", channelId);

  return { typing, stopTyping };
}
