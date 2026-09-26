import { HttpException } from '@nestjs/common';
import axios from 'axios';
import { ProviderError } from './provider-error.js';

const messages: Record<number, string> = {
  400: 'درخواست نامعتبر است.',
  401: 'برای ادامه وارد حساب کاربری شوید.',
  403: 'شما مجوز انجام این عملیات را ندارید.',
  404: 'مورد درخواستی یافت نشد.',
  409: 'اطلاعات واردشده با اطلاعات موجود تداخل دارد.',
  422: 'اطلاعات واردشده نامعتبر است.',
  429: 'تعداد درخواست‌ها بیش از حد مجاز است. کمی بعد تلاش کنید.',
  500: 'خطای داخلی سرور رخ داد. لطفاً دوباره تلاش کنید.',
  502: 'پاسخ سرویس احراز هویت معتبر نیست.',
  503: 'سرویس احراز هویت در دسترس نیست. لطفاً کمی بعد تلاش کنید.',
  504: 'مهلت پاسخ‌گویی سرویس احراز هویت به پایان رسید.',
};

function record(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown> : {};
}

function messageText(value: unknown): string | undefined {
  if (typeof value === 'string' && value.trim()) return value;
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string').join('\n') || undefined;
  }
  const translated = record(value);
  if (typeof translated.fa === 'string' && translated.fa.trim()) return translated.fa;
  if (typeof translated.en === 'string' && translated.en.trim()) return translated.en;
}

function validStatus(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 400 && value <= 599
    ? value : fallback;
}

function failure(statusCode: number, message?: string) {
  return { status: 'fail' as const, statusCode, message: message ?? messages[statusCode] ?? messages[500] };
}

function providerFailure(body: unknown, httpStatus: number) {
  const data = record(body);
  const result = record(data.result);
  const status = validStatus(result.status_code, validStatus(httpStatus, 502));
  // Provider credentials are ours; their 401 is not an expired user session.
  if (httpStatus === 401 || status === 401) return failure(503);
  if (status >= 500) return failure(502);
  return failure(status, messageText(result.message_developer) ?? messageText(data.message));
}

/** The only place that selects public error messages and HTTP status codes. */
export function normalizeError(error: unknown) {
  if (error instanceof ProviderError) return providerFailure(error.body, error.status);
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') return failure(504);
    if (error.response) return providerFailure(error.response.data, error.response.status);
    return failure(503);
  }
  if (error instanceof HttpException) {
    const status = validStatus(error.getStatus(), 500);
    const body = error.getResponse();
    // Server failures never expose raw exceptions or internal details.
    if (status >= 500) return failure(status);
    const data = record(body);
    return failure(status, messageText(typeof body === 'string' ? body : data.message ?? data.message_developer));
  }
  return failure(500);
}
