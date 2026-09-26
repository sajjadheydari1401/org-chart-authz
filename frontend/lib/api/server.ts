import "server-only";
import type { AxiosRequestConfig } from "axios";
import { API } from "./client";
import { getAccessToken } from "@/lib/auth/session";
import { ApiError } from "./error";
import { apiErrorSchema, apiSuccessSchema } from "./response";
import { TRANSPORT_ERROR_MESSAGE } from "./transport-error";

type ApiRequestConfig = AxiosRequestConfig & { authenticated?: boolean };

export async function AppApi<T>(
  path: string,
  { authenticated = true, ...config }: ApiRequestConfig = {},
): Promise<T> {
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
    throw new ApiError(failure.data.statusCode, failure.data.message);
  }
  if (response.status < 200 || response.status >= 300) {
    throw new ApiError(response.status, TRANSPORT_ERROR_MESSAGE);
  }
  if (response.status === 204) return undefined as T;

  const success = apiSuccessSchema.safeParse(response.data);
  if (!success.success) throw new ApiError(502, TRANSPORT_ERROR_MESSAGE);
  return success.data.data as T;
}
