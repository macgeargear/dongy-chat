import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type CreateChannelInput } from "@/components/channels/create-channel-dialog";
import api from "@/lib/axios";

export function useCreateChannel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateChannelInput) => {
      const res = await api.post("/api/channel", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["channels"] });
    },
  });
}
