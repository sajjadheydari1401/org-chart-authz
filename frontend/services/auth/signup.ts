import "server-only";

import { responseSchema, type SignupFormData } from "@/lib/schemas/auth";
import type { AuthActionResult, SignupRequest } from "@/types/auth";

/** Sends only user-entered fields to our NestJS backend. */
export async function registerAccount(
  input: SignupFormData,
): Promise<AuthActionResult> {
  const apiUrl = process.env.API_URL;

  if (!apiUrl) {
    return {
      success: false,
      message:
        "سرویس ثبت‌نام پیکربندی نشده است. لطفاً با پشتیبانی تماس بگیرید.",
    };
  }

  const body: SignupRequest = {
    email: input.email,
    username: input.username,
    password: input.password,
    mobile: input.mobile,
  };

  try {
    const response = await fetch(`${apiUrl.replace(/\/$/, "")}/auth/signup`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
      redirect: "error",
    });

    const parsed = responseSchema.safeParse(await response.json());
    if (parsed.success && !parsed.data.success) return parsed.data;
    if (response.ok && parsed.success && parsed.data.success)
      return { success: true };

    return {
      success: false,
      message: "ایجاد حساب انجام نشد. لطفاً دوباره تلاش کنید.",
    };
  } catch (err) {
    return {
      success: false,
      message: "سرویس ثبت‌نام در حال حاضر در دسترس نیست. لطفاً دوباره تلاش کنید.",
    };
  }
}
