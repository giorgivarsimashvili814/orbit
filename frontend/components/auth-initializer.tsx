"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";

const AuthInitializer = () => {
  const { setAuth, user, accessToken } = useAuthStore();

  useEffect(() => {
    const restore = async () => {
      if (accessToken) return;

      const pathname = window.location.pathname;
      if (pathname === "/login" || pathname === "/register") return;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
        { method: "POST", credentials: "include" },
      );

      if (!res.ok) return;

      const json = await res.json();
      if (json?.accessToken) {
        setAuth(json.accessToken, json.user ?? user);
      }
    };

    restore();
  }, []);

  return null;
};

export default AuthInitializer;
