import "server-only";

import { z } from "zod";
import type { SignupFormData } from "@/lib/schemas/auth";
import type { AuthActionResult, SignupRequest, SignupResponse } from "@/types/auth";

const requiredSetting = z.string().refine((value) => value.trim().length > 0);
const signupConfigSchema = z.object({
  url: z.url().refine((value) => value.startsWith("https://")),
  systemUsername: requiredSetting,
  systemPassword: requiredSetting,
  roleName: requiredSetting,
  smsTemplate: requiredSetting,
  patternName: requiredSetting,
  smsSystemName: requiredSetting,
});

const signupResponseSchema = z.object({
  success: z.boolean(),
  result: z.unknown(),
  message: z.string(),
});

/** Calls the original authentication service without forwarding a session token. */
export async function registerAccount(input: SignupFormData): Promise<AuthActionResult> {
  const config = signupConfigSchema.safeParse({
    url: process.env.AUTH_SIGNUP_URL,
    systemUsername: process.env.AUTH_SYSTEM_USERNAME,
    systemPassword: process.env.AUTH_SYSTEM_PASSWORD,
    roleName: process.env.AUTH_ROLE_NAME,
    smsTemplate: process.env.AUTH_SMS_TEMPLATE,
    patternName: process.env.AUTH_PATTERN_NAME,
    smsSystemName: process.env.AUTH_SMS_SYSTEM_NAME,
  });

  if (!config.success) {
    return { success: false, message: "Registration service is not configured. Please contact support." };
  }

  const { url, ...settings } = config.data;
  const body: SignupRequest = {
    ...settings,
    email: input.email,
    username: input.username,
    password: input.password,
    mobile_number: input.mobile,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
      redirect: "error",
    });

    if (response.status === 401) {
      return { success: false, message: "Registration service credentials are not configured correctly. Please contact support." };
    }

    if (!response.ok) {
      return { success: false, message: "Unable to create your account. Please try again." };
    }

    const parsed = signupResponseSchema.safeParse(await response.json());
    if (!parsed.success) {
      return { success: false, message: "Registration service returned an invalid response. Please try again." };
    }

    const result: SignupResponse = parsed.data;
    if (!result.success) {
      // Provider messages may contain internal details; don't forward them to the browser.
      return { success: false, message: "Unable to create your account. Please check your details and try again." };
    }

    return { success: true };
  } catch (error) {
    if (error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")) {
      return { success: false, message: "Registration timed out. Please try again." };
    }

    // Never log the request or raw errors, which could expose registration credentials.
    return { success: false, message: "Unable to reach the registration service or read its response. Please try again." };
  }
}
