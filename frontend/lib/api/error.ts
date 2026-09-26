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
  400: "درخواست نامعتبر است.",
  401: "نشست شما منقضی شده است. لطفاً دوباره وارد شوید.",
  403: "شما مجوز انجام این عملیات را ندارید.",
  404: "مورد درخواستی یافت نشد.",
  409: "این مورد قبلاً ثبت شده است.",
  422: "اطلاعات واردشده نامعتبر است.",
  429: "تعداد درخواست‌ها بیش از حد مجاز است. لطفاً کمی بعد دوباره تلاش کنید.",
  500: "خطایی رخ داده است. لطفاً کمی بعد دوباره تلاش کنید.",
  502: "سرویس در حال حاضر در دسترس نیست. لطفاً دوباره تلاش کنید.",
  503: "سرویس در حال حاضر در دسترس نیست. لطفاً کمی بعد دوباره تلاش کنید.",
  504: "مهلت پاسخ‌گویی به درخواست به پایان رسید. لطفاً دوباره تلاش کنید.",
};

export function createApiError(
  status: number,
  error?: ApiErrorResponse | null,
): ApiError {
  const message =
    errorMessages[status] ?? "خطایی رخ داده است. لطفاً دوباره تلاش کنید.";

  return new ApiError(status, message);
}
