import { ApiError } from './api-error';
import type { AppApiResponse } from './app-api-response';
import { apiErrorSchema, apiSuccessSchema } from './response';
import { TRANSPORT_ERROR_MESSAGE } from './transport-error';

type ClientApiRequestConfig = Omit<RequestInit, 'body'> & { data?: unknown };

function getMessage(message: unknown): string | undefined {
  if (typeof message === 'string') return message;
  if (typeof message !== 'object' || message === null) return undefined;

  const localized = message as { fa?: unknown; en?: unknown };
  if (typeof localized.fa === 'string' && localized.fa.trim()) {
    return localized.fa.trim();
  }
  if (typeof localized.en === 'string' && localized.en.trim()) {
    return localized.en.trim();
  }
  return undefined;
}

export async function AppApi<T>(
  path: string,
  { data, headers: requestHeaders, ...config }: ClientApiRequestConfig = {},
): Promise<AppApiResponse<T>> {
  if (!path.startsWith('/')) {
    throw new Error('AppApi paths must start with /.');
  }

  const headers = new Headers(requestHeaders);
  headers.set('Accept', 'application/json');
  if (data !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`/api${path}`, {
    ...config,
    headers,
    credentials: 'same-origin',
    cache: 'no-store',
    body: data === undefined ? undefined : JSON.stringify(data),
  });
  const body: unknown = await response.json().catch(() => undefined);

  const failure = apiErrorSchema.safeParse(body);
  if (failure.success) {
    throw new ApiError(
      failure.data.statusCode,
      failure.data.message,
      response.status === 401 || failure.data.statusCode === 401,
    );
  }
  if (!response.ok) {
    throw new ApiError(
      response.status,
      TRANSPORT_ERROR_MESSAGE,
      response.status === 401,
    );
  }
  if (response.status === 204) return { data: undefined as T };

  const success = apiSuccessSchema.safeParse(body);
  if (!success.success) throw new ApiError(502, TRANSPORT_ERROR_MESSAGE);

  const message = getMessage(success.data.message);
  return {
    data: success.data.data as T,
    ...(message ? { message } : {}),
  };
}
