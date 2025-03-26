import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export type Message = {
  id: string;
  content: string;
  channelId: string;
  createdAt: string;
  sender: {
    id: string;
    username: string;
  };
  channel: {
    name: string | null;
    isPrivate: boolean;
    channelMembers: {
      user: {
        id: string;
        username: string;
      };
    }[];
  };
};

export function useMessages(channelId: string) {
  return useQuery({
    queryKey: ["messages", channelId],
    queryFn: async () => {
      const res = await api.get<Message[]>(`/api/messages/${channelId}`);
      return res.data;
    },
    enabled: !!channelId, // avoid running when undefined
  });
}
