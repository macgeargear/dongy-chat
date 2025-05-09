import { useEffect } from "react";
import { socket } from "@/lib/socket";
import type { Message, User } from "@/types";

export function useChatSocket(
  channelId: string,
  user: User,
  onMessage: (msg: any) => void,
  onActiveUser: (user: any) => void,
) {
  useEffect(() => {
    socket.emit("join_channel", { channelId, user });
    socket.on("receive_message", onMessage);
    socket.on("activeUsers", onActiveUser);

    return () => {
      socket.emit("leave_channel", { channelId, user });
      socket.off("receive_message", onMessage);
      socket.off("activeUsers", onActiveUser);
    };
  }, [channelId, user]);

  const sendMessage = (msg: Message) => {
    onMessage(msg);
    socket.emit("send_message", {
      channelId,
      content: msg.content,
      msg,
      id: msg.id,
    });
  };

  return { sendMessage };
}
