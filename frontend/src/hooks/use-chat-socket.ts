import { useEffect } from "react";
import { socket } from "@/lib/socket";
import type { Message } from "@/types";

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

  const sendMessage = (msg: Message) => {
    socket.emit("send_message", { channelId, content: msg.content, msg });
  };

  return { sendMessage };
}
