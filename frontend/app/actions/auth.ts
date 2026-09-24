"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { api } from "@/lib/api/server";
import { ApiError } from "@/lib/api/error";
import { registerAccount } from "@/lib/auth/signup";
import {
  clearPendingMobile,
  clearSession,
  getPendingMobile,
  setAccessToken,
  setPendingMobile,
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
      message: "Please check the form",
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

  await setPendingMobile(parsed.data.mobile);

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
      message: "Please check the form",
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
      message: "Unable to sign in",
    };
  }

  await setAccessToken(result.accessToken);
  await clearPendingMobile();

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
      message: "Please check the verification code",
      fieldErrors: {
        ...(errors.properties?.code?.errors[0] && {
          code: errors.properties.code.errors[0],
        }),
      },
    };
  }

  const mobile = await getPendingMobile();

  if (!mobile) {
    return {
      success: false,
      message: "Your verification session has expired. Please sign up again.",
    };
  }

  const body: VerifySmsRequest = {
    mobile,
    code: parsed.data.code,
  };

  let result: AuthTokenResponse;

  try {
    result = await api<AuthTokenResponse>("/auth/verify-sms", {
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
      message: "Unable to verify the SMS code",
    };
  }

  await setAccessToken(result.accessToken);
  await clearPendingMobile();

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
