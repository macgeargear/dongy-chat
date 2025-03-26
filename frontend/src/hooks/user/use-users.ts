import api from "@/lib/axios";
import type { User } from "@/types";
import { useQuery } from "@tanstack/react-query";

export async function getUsers() {
  const res = await api.get<User[]>("/api/user");
  return res.data;
}

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
}
