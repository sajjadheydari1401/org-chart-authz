import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { ClearAuthUser } from "@/components/auth/clear-auth-user";
import { getAccessToken } from "@/lib/auth/session";

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const accessToken = await getAccessToken();

  if (accessToken) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <ClearAuthUser />
      <div className="w-full max-w-md">{children}</div>
    </main>
  );
}
