import "server-only";

import { responseSchema, type VerifySmsFormData } from "@/lib/schemas/auth";
import type { AuthActionResult, VerifySmsRequest } from "@/types/auth";
import { getPendingUsername } from "@/lib/auth/session";

export async function verifyPhoneNumber(
  input: VerifySmsFormData,
): Promise<AuthActionResult> {
  const apiUrl = process.env.API_URL;

  if (!apiUrl) {
    return {
      success: false,
      message:
        "Registration service is not configured. Please contact support.",
    };
  }

  const finalApiUrl = apiUrl.replace(/\/$/, "");

  const body: VerifySmsRequest = {
    code: input.code,
  };

  const finalBody = {
    ...body,
    username: await getPendingUsername(),
  };

  try {
    const response = await fetch(`${finalApiUrl}/auth/confirm-sms`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(finalBody),
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
      message: "Unable to verify your phone. Please try again.",
    };
  } catch (err) {
    return {
      success: false,
      message: "Verification is currently unavailable. Please try again.",
    };
  }
}
