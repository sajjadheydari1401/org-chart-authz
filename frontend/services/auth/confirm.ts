import "server-only";
import { AppApi } from "@/lib/api/server";
import { toActionError } from "@/lib/api/error";
import { getPendingUsername } from "@/lib/auth/session";
import type { VerifySmsFormData } from "@/lib/schemas/auth";
import type { AuthActionResult } from "@/types/auth";

export async function verifyPhoneNumber(
  input: VerifySmsFormData,
): Promise<AuthActionResult> {
  try {
    const response = await AppApi("/auth/confirm-sms", {
      method: "POST",
      authenticated: false,
      data: { code: input.code, username: await getPendingUsername() },
    });
    return {
      success: true,
      ...(response.message ? { message: response.message } : {}),
    };
  } catch (error) {
    return toActionError(error);
  }
}
