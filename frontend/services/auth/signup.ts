import "server-only";
import { AppApi } from "@/lib/api/server";
import { toActionError } from "@/lib/api/error";
import type { SignupFormData } from "@/lib/schemas/auth";
import type { AuthActionResult, SignupRequest } from "@/types/auth";

export async function registerAccount(
  input: SignupFormData,
): Promise<AuthActionResult> {
  const body: SignupRequest = {
    email: input.email,
    username: input.username,
    password: input.password,
    mobile: input.mobile,
  };
  try {
    await AppApi("/auth/signup", {
      method: "POST",
      data: body,
      authenticated: false,
    });
    return { success: true };
  } catch (error) {
    return toActionError(error);
  }
}
