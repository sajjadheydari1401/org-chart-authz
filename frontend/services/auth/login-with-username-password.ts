import 'server-only';
import { AppApi } from '@/lib/api/server';
import type { AppApiResponse } from '@/lib/api/server';
import type {
  AuthTokenResponse,
  LoginWithUsernamePasswordRequest,
} from '@/types/auth/auth';

export function loginWithUsernamePassword(
  input: LoginWithUsernamePasswordRequest,
): Promise<AppApiResponse<AuthTokenResponse>> {
  return AppApi<AuthTokenResponse>('/auth/login/username-password', {
    method: 'POST',
    data: input,
    authenticated: false,
  });
}
