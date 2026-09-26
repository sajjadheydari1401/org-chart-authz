import { z } from "zod";

function normalizeDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));
}

export const signupSchema = z.object({
  email: z.string().trim().email("لطفاً یک آدرس ایمیل معتبر وارد کنید"),

  username: z
    .string()
    .trim()
    .min(2, "نام کاربری باید حداقل ۲ کاراکتر باشد")
    .max(40, "نام کاربری باید حداکثر ۴۰ کاراکتر باشد"),

  password: z.string().min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد"),

  mobile: z
    .string()
    .trim()
    .transform(normalizeDigits)
    .refine(
      (value) => /^09\d{9}$/.test(value),
      "لطفاً یک شماره موبایل ایرانی معتبر وارد کنید",
    ),
});

export const loginSchema = z.object({
  email: z.string().trim().email("لطفاً یک آدرس ایمیل معتبر وارد کنید"),

  password: z.string().min(1, "وارد کردن رمز عبور الزامی است"),
});

export const verifySmsSchema = z.object({
  code: z
    .string()
    .trim()
    .transform(normalizeDigits)
    .refine(
      (value) => /^\d{6}$/.test(value),
      "لطفاً کد تأیید ۶ رقمی را وارد کنید",
    ),
});

export type SignupFormInput = z.input<typeof signupSchema>;
export type SignupFormData = z.output<typeof signupSchema>;

export type LoginFormInput = z.input<typeof loginSchema>;
export type LoginFormData = z.output<typeof loginSchema>;

export type VerifySmsFormInput = z.input<typeof verifySmsSchema>;
export type VerifySmsFormData = z.output<typeof verifySmsSchema>;
