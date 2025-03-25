import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { type CreateChannelInput } from "@/components/channels/create-channel-dialog";

export function useCreateChannel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateChannelInput) => {
      const res = await axios.post("/api/channel", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["channels"] });
    },
  });
}
