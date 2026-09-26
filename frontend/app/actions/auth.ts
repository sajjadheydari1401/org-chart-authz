"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { api } from "@/lib/api/server";
import { ApiError } from "@/lib/api/error";
import { registerAccount } from "@/services/auth/signup";
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
  VerifySmsRequest,
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

  await setPendingUsername(parsed.data.mobile);

  redirect("/verify-sms");
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
        ...(errors.properties?.email?.errors[0] && {
          email: errors.properties.email.errors[0],
        }),
        ...(errors.properties?.password?.errors[0] && {
          password: errors.properties.password.errors[0],
        }),
      },
    };
  }

  const body: LoginRequest = {
    email: parsed.data.email,
    password: parsed.data.password,
  };

  let result: AuthTokenResponse;

  try {
    result = await api<AuthTokenResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        message: error.message,
      };
    }

    console.error("Login failed:", error);

    return {
      success: false,
      message: "ورود به حساب کاربری امکان‌پذیر نیست",
    };
  }

  await setAccessToken(result.accessToken);
  await clearPendingUsername();

  redirect("/dashboard");
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

  const body: VerifySmsRequest = {
    code: parsed.data.code,
  };

  let result: AuthTokenResponse;

  try {
    result = await api<AuthTokenResponse>("/confirm-sms", {
      method: "POST",
      body: JSON.stringify(body),
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        message: error.message,
      };
    }

    console.error("SMS verification failed:", error);

    return {
      success: false,
      message: "تأیید کد پیامکی امکان‌پذیر نیست",
    };
  }

  await setAccessToken(result.accessToken);
  await clearPendingUsername();

  redirect("/dashboard");
}

/*
|--------------------------------------------------------------------------
| Logout
|--------------------------------------------------------------------------
*/

export async function logoutAction(): Promise<void> {
  await clearSession();

  redirect("/login");
}
