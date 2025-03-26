import type { UpdateChannelInput } from "@/components/channels/update-channel-dialog";
import api from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateChannel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateChannelInput) => {
      const res = await api.put(`/api/channel/${data.id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["channels"] });
    },
  });
}
