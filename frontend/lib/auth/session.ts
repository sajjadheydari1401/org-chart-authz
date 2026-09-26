import "server-only";

import { cookies } from "next/headers";

const ACCESS_TOKEN_COOKIE = "access_token";
const PENDING_USERNAME_COOKIE = "pending_username";

export async function setAccessToken(token: string): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(ACCESS_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();

  return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
}

export async function clearAccessToken(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete(ACCESS_TOKEN_COOKIE);
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(PENDING_USERNAME_COOKIE);
}

export async function setPendingUsername(username: string): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(PENDING_USERNAME_COOKIE, username, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",

    // Temporary verification state.
    maxAge: 10 * 60,
  });
}

export async function getPendingUsername(): Promise<string | null> {
  const cookieStore = await cookies();

  return cookieStore.get(PENDING_USERNAME_COOKIE)?.value ?? null;
}

export async function clearPendingUsername(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete(PENDING_USERNAME_COOKIE);
}

export function maskMobile(mobile: string) {
  if (mobile.length < 7) {
    return mobile;
  }

  return `${mobile.slice(0, 4)}***${mobile.slice(-4)}`;
}
