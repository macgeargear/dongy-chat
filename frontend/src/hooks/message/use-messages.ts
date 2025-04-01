import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { Message } from "@/types";

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
