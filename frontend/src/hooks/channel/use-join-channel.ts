import api from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useJoinChannel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      channelId,
      userId,
    }: {
      channelId: string;
      userId: string;
    }) => {
      const res = await api.post("/api/channel-member", { channelId, userId });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["channels"] });
    },
  });
}
