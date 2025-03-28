import api from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useAddUserChannel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      channelId,
    }: {
      userId: string;
      channelId: string;
    }) => {
      const res = await api.post("/api/channel-member", {
        userId,
        channelId,
      });

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["channels"] });
    },
  });
}
