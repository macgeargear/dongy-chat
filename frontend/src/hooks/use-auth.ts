import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { User } from "@/types";

export async function fetchMe(): Promise<User> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token");
  const res = await api.get("/api/auth/me");
  return res.data;
}

export function useAuth() {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
    enabled: !!localStorage.getItem("token"),
    retry: false,
  });

  const login = useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const res = await api.post("/api/auth/login", data);
      localStorage.setItem("token", res.data.token);
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.fetchQuery({
        queryKey: ["me"],
        queryFn: fetchMe,
      });
      // queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });

  const logout = () => {
    localStorage.clear();
    window.location.href = "/auth";
  };

  const signup = useMutation({
    mutationFn: async (data: {
      username: string;
      password: string;
      displayName: string;
    }) => {
      const res = await api.post("/api/auth/signup", data);
      localStorage.setItem("token", res.data.token);
      return res.data;
    },
    onSuccess: async () => {
      // queryClient.invalidateQueries({ queryKey: ["me"] });
      await queryClient.fetchQuery({
        queryKey: ["me"],
        queryFn: fetchMe,
      });
    },
  });

  return {
    user,
    isLoading,
    isError,
    login: login.mutateAsync,
    signup: signup.mutateAsync,
    logout,
  };
}
