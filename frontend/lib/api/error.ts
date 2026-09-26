import type { AuthActionError } from "@/types/auth";
import { redirect } from "next/navigation";
import { TRANSPORT_ERROR_MESSAGE } from "./transport-error";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly sessionExpired = false,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Server Actions must return serializable errors rather than throw them to the browser.
export function toActionError(error: unknown): AuthActionError {
  if (error instanceof ApiError && error.sessionExpired) {
    redirect("/login");
  }

  return {
    success: false,
    message:
      error instanceof ApiError ? error.message : TRANSPORT_ERROR_MESSAGE,
  };
}
