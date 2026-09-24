import type { ApiErrorResponse } from "@/types/api";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const errorMessages: Record<number, string> = {
  400: "The request is invalid.",
  401: "Your session has expired. Please sign in again.",
  403: "You don't have permission to perform this action.",
  404: "The requested resource was not found.",
  409: "This resource already exists.",
  422: "The provided information is invalid.",
  429: "Too many requests. Please try again later.",
  500: "Something went wrong. Please try again later.",
};

export function createApiError(
  status: number,
  error?: ApiErrorResponse | null,
): ApiError {
  const message =
    errorMessages[status] ?? "Something went wrong. Please try again.";

  return new ApiError(status, message);
}
