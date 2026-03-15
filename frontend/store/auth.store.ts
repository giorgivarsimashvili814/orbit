import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  user: { id: string; email: string } | null;
  setAuth: (accessToken: string, user: { id: string; email: string }) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  setAuth: (accessToken, user) => set({ accessToken, user }),
  clearAuth: () => set({ accessToken: null, user: null }),
}));
