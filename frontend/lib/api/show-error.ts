"use client";

import { toast } from "react-toastify";

export function showError(message: string) {
  toast.error(message, { toastId: message });
}

export function showSuccess(message: string) {
  toast.success(message, { toastId: `success:${message}` });
}
