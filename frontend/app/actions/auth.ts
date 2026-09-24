"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { api } from "@/lib/api/server";
import { ApiError } from "@/lib/api/error";
import { setPendingMobile } from "@/lib/auth/session";
import { signupSchema, type SignupFormData } from "@/lib/schemas/auth";
import type { AuthActionResult, SignupRequest } from "@/types/auth";

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

  const body: SignupRequest = {
    email: parsed.data.email,
    username: parsed.data.username,
    password: parsed.data.password,
    mobile: parsed.data.mobile,
  };

  try {
    await api<void>("/signup", {
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

    console.error("Signup failed:", error);

    return {
      success: false,
      message: "Unable to create your account",
    };
  }

  await setPendingMobile(parsed.data.mobile);

  redirect("/verify-sms");
}
