import api from "@/lib/axios";
import type { Channel } from "@/types";
import { useQuery } from "@tanstack/react-query";

export async function getChannel({
  id,
  includeMembers,
  includeMessages,
}: {
  includeMembers?: boolean;
  includeMessages?: boolean;
  id: string;
}) {
  const params = new URLSearchParams();
  if (includeMessages) params.append("messages", "true");
  if (includeMembers) params.append("members", "true");

  const res = await api.get<Channel[]>(`/api/channel/${id}`, {
    params,
  });
  return res.data;
}

export function useChannel({
  id,
  includeMembers = false,
  includeMessages = false,
}: {
  id: string;
  includeMembers?: boolean;
  includeMessages?: boolean;
}) {
  return useQuery({
    queryKey: ["channels", includeMembers, includeMessages],
    queryFn: () =>
      getChannel({
        id,
        includeMembers,
        includeMessages,
      }),
  });
}
