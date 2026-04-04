import api, { setAccessToken } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AuthContext, type User } from "./AuthContext";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const { isLoading } = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      const res = await api.post("/auth/refresh");
      setAccessToken(res.data.accessToken);
      setUser(res.data.user);
      return res.data.user;
    },
    retry: false,
    staleTime: Infinity,
  });

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    setAccessToken(res.data.accessToken);
    setUser(res.data.user);
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setAccessToken(null);
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading: isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
