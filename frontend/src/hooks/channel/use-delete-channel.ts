import api from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteChannel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (channelId: string) => {
      const res = await api.delete(`/api/channel/${channelId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["channels"] });
    },
  });
}
