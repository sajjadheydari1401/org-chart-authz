"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";
import { AppButton } from "@/components/common/ui/app-button";
import { useAuthUserStore } from "@/lib/auth/user-store";

export function LogoutButton() {
  const router = useRouter();
  const clearUser = useAuthUserStore((state) => state.clearUser);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function logout() {
    setIsLoggingOut(true);
    await logoutAction();
    clearUser();
    router.replace("/login");
    router.refresh();
  }

  return (
    <AppButton
      type="button"
      variant="secondary"
      size="sm"
      loading={isLoggingOut}
      onClick={logout}
    >
      خروج
    </AppButton>
  );
}
