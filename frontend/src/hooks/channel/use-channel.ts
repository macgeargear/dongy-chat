import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { Channel } from "@/types";


export function useChannel(channelId: string) {
  return useQuery({
    queryKey: ["channels", channelId],
    queryFn: async () => {
      const res = await api.get<Channel>(`/api/channel/${channelId}`);
      return res.data;
    },
    enabled: !!channelId, 
  });
}
