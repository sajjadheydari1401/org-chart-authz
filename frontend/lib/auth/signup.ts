import 'server-only';

import { z } from 'zod';
import type { SignupFormData } from '@/lib/schemas/auth';
import type { AuthActionResult, SignupRequest } from '@/types/auth';

const responseSchema = z.discriminatedUnion('success', [
  z.object({ success: z.literal(true) }),
  z.object({ success: z.literal(false), message: z.string() }),
]);

/** Sends only user-entered fields to our NestJS backend. */
export async function registerAccount(input: SignupFormData): Promise<AuthActionResult> {
  const apiUrl = process.env.API_URL;
  if (!apiUrl) {
    return { success: false, message: 'Registration service is not configured. Please contact support.' };
  }

  const body: SignupRequest = {
    email: input.email,
    username: input.username,
    password: input.password,
    mobile: input.mobile,
  };

  try {
    const response = await fetch(`${apiUrl.replace(/\/$/, '')}/auth/signup`, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
      signal: AbortSignal.timeout(20_000),
      redirect: 'error',
    });
    const parsed = responseSchema.safeParse(await response.json());
    if (parsed.success && !parsed.data.success) return parsed.data;
    if (response.ok && parsed.success && parsed.data.success) return { success: true };

    return { success: false, message: 'Unable to create your account. Please try again.' };
  } catch {
    return { success: false, message: 'Registration is currently unavailable. Please try again.' };
  }
}
