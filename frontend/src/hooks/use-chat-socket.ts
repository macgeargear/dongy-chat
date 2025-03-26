import { useEffect } from "react";
import { socket } from "@/lib/socket";

export function useChatSocket(
  channelId: string,
  onMessage: (msg: any) => void,
) {
  useEffect(() => {
    socket.emit("join_channel", channelId, () => {});
    socket.on("receive_message", onMessage);
    return () => {
      socket.off("receive_message", onMessage);
    };
  }, [channelId, onMessage]);

  const sendMessage = (content: string) => {
    socket.emit("send_message", { channelId, content });
  };

  return { sendMessage };
}
