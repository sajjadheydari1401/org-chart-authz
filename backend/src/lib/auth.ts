import { ProviderSignupResponse } from '../types/auth.js';

export function isProviderResponse(
  value: unknown,
): value is ProviderSignupResponse {
  return (
    typeof value === 'object' &&
    value !== null &&
    'success' in value &&
    typeof value.success === 'boolean'
  );
}
