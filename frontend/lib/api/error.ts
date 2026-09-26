import type { AuthActionError } from "@/types/auth";
import { TRANSPORT_ERROR_MESSAGE } from "./transport-error";

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

// Server Actions must return serializable errors rather than throw them to the browser.
export function toActionError(error: unknown): AuthActionError {
  return {
    success: false,
    message: error instanceof ApiError ? error.message : TRANSPORT_ERROR_MESSAGE,
  };
}
