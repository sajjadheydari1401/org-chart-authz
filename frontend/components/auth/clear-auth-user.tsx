"use client";

import { useEffect } from "react";
import { useAuthUserStore } from "@/lib/auth/user-store";

export function ClearAuthUser() {
  const clearUser = useAuthUserStore((state) => state.clearUser);

  useEffect(() => {
    clearUser();
  }, [clearUser]);

  return null;
}
