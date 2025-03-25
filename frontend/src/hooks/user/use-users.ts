import api from "@/lib/axios";
import type { User } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await api.get<User[]>("/api/users");
      return response.data;
    },
  });
}
