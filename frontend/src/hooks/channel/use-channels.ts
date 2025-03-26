import api from "@/lib/axios";
import type { Channel } from "@/types";
import { useQuery } from "@tanstack/react-query";

export async function getChannels({
  includeMembers = false,
  includeMessages = false,
}: {
  includeMembers?: boolean;
  includeMessages?: boolean;
} = {}) {
  const params = new URLSearchParams();
  if (includeMessages) params.append("messages", "true");
  if (includeMembers) params.append("members", "true");

  const res = await api.get<Channel[]>(`/api/channel?${params.toString()}`);
  return res.data;
}

export function useChannels({
  includeMembers = false,
  includeMessages = false,
}: {
  includeMembers?: boolean;
  includeMessages?: boolean;
} = {}) {
  return useQuery({
    queryKey: ["channels", includeMembers, includeMessages],
    queryFn: () =>
      getChannels({
        includeMembers,
        includeMessages,
      }),
  });
}
