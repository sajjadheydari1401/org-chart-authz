"use server";

import { z } from "zod";

import { AppApi } from "@/lib/api/server";
import { toActionError } from "@/lib/api/error";
import { registerAccount } from "@/services/auth/signup";
import { verifyPhoneNumber } from "@/services/auth/confirm";
import {
  clearPendingUsername,
  clearSession,
  getPendingUsername,
  setAccessToken,
  setPendingUsername,
} from "@/lib/auth/session";
import {
  loginSchema,
  signupSchema,
  verifySmsSchema,
  type LoginFormData,
  type SignupFormData,
  type VerifySmsFormData,
} from "@/lib/schemas/auth";
import type {
  AuthActionResult,
  AuthTokenResponse,
  LoginRequest,
} from "@/types/auth";

/*
|--------------------------------------------------------------------------
| Signup
|--------------------------------------------------------------------------
*/

export async function signupAction(
  input: SignupFormData,
): Promise<AuthActionResult> {
  const parsed = signupSchema.safeParse(input);

  if (!parsed.success) {
    const errors = z.treeifyError(parsed.error);

    return {
      success: false,
      message: "لطفاً فرم را بررسی کنید",
      fieldErrors: {
        ...(errors.properties?.email?.errors[0] && {
          email: errors.properties.email.errors[0],
        }),
        ...(errors.properties?.username?.errors[0] && {
          username: errors.properties.username.errors[0],
        }),
        ...(errors.properties?.password?.errors[0] && {
          password: errors.properties.password.errors[0],
        }),
        ...(errors.properties?.mobile?.errors[0] && {
          mobile: errors.properties.mobile.errors[0],
        }),
      },
    };
  }

  const result = await registerAccount(parsed.data);
  if (!result.success) return result;

  await setPendingUsername(parsed.data.username);

  return result;
}

/*
|--------------------------------------------------------------------------
| Login
|--------------------------------------------------------------------------
*/

export async function loginAction(
  input: LoginFormData,
): Promise<AuthActionResult> {
  const parsed = loginSchema.safeParse(input);

  if (!parsed.success) {
    const errors = z.treeifyError(parsed.error);

    return {
      success: false,
      message: "لطفاً فرم را بررسی کنید",
      fieldErrors: {
        ...(errors.properties?.username?.errors[0] && {
          username: errors.properties.username.errors[0],
        }),
        ...(errors.properties?.password?.errors[0] && {
          password: errors.properties.password.errors[0],
        }),
      },
    };
  }

  const body: LoginRequest = {
    username: parsed.data.username,
    password: parsed.data.password,
  };

  let result: { data: AuthTokenResponse; message?: string };

  try {
    result = await AppApi<AuthTokenResponse>("/auth/login", {
      method: "POST",
      data: body,
      authenticated: false,
    });
  } catch (error) {
    return toActionError(error);
  }

  await setAccessToken(result.data.accessToken);
  await clearPendingUsername();

  return {
    success: true,
    ...(result.message ? { message: result.message } : {}),
    user: {
      username: result.data.username,
      userId: result.data.userId,
    },
  };
}

/*
|--------------------------------------------------------------------------
| Verify SMS
|--------------------------------------------------------------------------
*/

export async function verifySmsAction(
  input: VerifySmsFormData,
): Promise<AuthActionResult> {
  const parsed = verifySmsSchema.safeParse(input);

  if (!parsed.success) {
    const errors = z.treeifyError(parsed.error);

    return {
      success: false,
      message: "لطفاً کد تأیید را بررسی کنید",
      fieldErrors: {
        ...(errors.properties?.code?.errors[0] && {
          code: errors.properties.code.errors[0],
        }),
      },
    };
  }

  const uName = await getPendingUsername();
  if (!uName) {
    return {
      success: false,
      message: "جلسه تأیید شما منقضی شده است. لطفاً دوباره ثبت‌نام کنید.",
    };
  }

  const result = await verifyPhoneNumber(parsed.data);
  if (!result.success) return result;

  await clearPendingUsername();

  return result;
}

/*
|--------------------------------------------------------------------------
| Logout
|--------------------------------------------------------------------------
*/

export async function logoutAction(): Promise<void> {
  await clearSession();
}
