import { z } from "zod";

export const responseSchema = z.discriminatedUnion("success", [
  z.object({ success: z.literal(true) }),
  z.object({ success: z.literal(false), message: z.string() }),
]);

function normalizeDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));
}

export const signupSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),

  username: z
    .string()
    .trim()
    .min(2, "Username must be at least 2 characters")
    .max(40, "Username must be at most 40 characters"),

  password: z.string().min(8, "Password must be at least 8 characters"),

  mobile: z
    .string()
    .trim()
    .transform(normalizeDigits)
    .refine(
      (value) => /^09\d{9}$/.test(value),
      "Enter a valid Iranian mobile number",
    ),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),

  password: z.string().min(1, "Password is required"),
});

export const verifySmsSchema = z.object({
  code: z
    .string()
    .trim()
    .transform(normalizeDigits)
    .refine(
      (value) => /^\d{6}$/.test(value),
      "Enter the 6-digit verification code",
    ),
});

export type SignupFormInput = z.input<typeof signupSchema>;
export type SignupFormData = z.output<typeof signupSchema>;

export type LoginFormInput = z.input<typeof loginSchema>;
export type LoginFormData = z.output<typeof loginSchema>;

export type VerifySmsFormInput = z.input<typeof verifySmsSchema>;
export type VerifySmsFormData = z.output<typeof verifySmsSchema>;
