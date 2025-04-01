import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

export function useSendMessage(channelId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      const res = await api.post("/api/messages", {
        channelId,
        content,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["messages", channelId],
      });
    },
  });
}
