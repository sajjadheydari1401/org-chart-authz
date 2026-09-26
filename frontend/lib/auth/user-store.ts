"use client";

import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import type { AuthUser } from "@/types/auth";

interface AuthUserState {
  user: AuthUser | null;
  setUser: (user: AuthUser) => void;
  clearUser: () => void;
}

export const useAuthUserStore = create<AuthUserState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        setUser: (user) => set({ user }, false, "auth/setUser"),
        clearUser: () => set({ user: null }, false, "auth/clearUser"),
      }),
      {
        name: "auth-user",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ user: state.user }),
      },
    ),
    {
      name: "AuthUserStore",
      enabled: process.env.NODE_ENV === "development",
    },
  ),
);
