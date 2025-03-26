import { useState, useEffect } from "react";
import api from "@/lib/axios";

export function useAuth() {
  const [user, setUser] = useState<{
    id: string;
    username: string;
    role: string;
  } | null>(null);

  async function login(username: string, password: string) {
    const res = await api.post("/api/auth/login", { username, password });
    console.log("Login successful...");
    localStorage.setItem("token", res.data.token);
    await fetchMe();
  }

  async function signup(
    username: string,
    password: string,
    displayName: string,
  ) {
    const res = await api.post("/api/auth/signup", {
      username,
      password,
      displayName,
    });
    localStorage.setItem("token", res.data.token);
  }

  async function fetchMe() {
    try {
      const res = await api.get("/api/auth/me");
      setUser(res.data);
    } catch {
      setUser(null);
    }
  }

  useEffect(() => {
    fetchMe();
  }, []);

  return { user, login, signup };
}
