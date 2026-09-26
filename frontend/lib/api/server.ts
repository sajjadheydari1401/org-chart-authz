import "server-only";
import type { AxiosRequestConfig } from "axios";
import { API } from "./client";
import { clearSession, getAccessToken } from "@/lib/auth/session";
import { ApiError } from "./error";
import { apiErrorSchema, apiSuccessSchema } from "./response";
import { TRANSPORT_ERROR_MESSAGE } from "./transport-error";

type ApiRequestConfig = AxiosRequestConfig & { authenticated?: boolean };

export interface AppApiResponse<T> {
  data: T;
  message?: string;
}

export async function AppApi<T>(
  path: string,
  { authenticated = true, ...config }: ApiRequestConfig = {},
): Promise<AppApiResponse<T>> {
  if (!API.defaults.baseURL) throw new Error("API_URL is not configured");

  const token = authenticated ? await getAccessToken() : null;
  const response = await API.request<unknown>({
    ...config,
    url: path,
    headers: {
      ...config.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    validateStatus: () => true,
  });

  const failure = apiErrorSchema.safeParse(response.data);
  if (failure.success) {
    const sessionExpired =
      authenticated &&
      (response.status === 401 || failure.data.statusCode === 401);
    if (sessionExpired) await clearSession();
    throw new ApiError(
      failure.data.statusCode,
      failure.data.message,
      sessionExpired,
    );
  }
  if (response.status < 200 || response.status >= 300) {
    const sessionExpired = authenticated && response.status === 401;
    if (sessionExpired) await clearSession();
    throw new ApiError(
      response.status,
      TRANSPORT_ERROR_MESSAGE,
      sessionExpired,
    );
  }
  if (response.status === 204) return { data: undefined as T };

  const success = apiSuccessSchema.safeParse(response.data);
  if (!success.success) throw new ApiError(502, TRANSPORT_ERROR_MESSAGE);
  const backendMessage = success.data.message;
  const message =
    typeof backendMessage === "string"
      ? backendMessage
      : backendMessage?.fa?.trim() || backendMessage?.en?.trim() || undefined;

  return { data: success.data.data as T, message };
}
