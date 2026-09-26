"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { showError, showSuccess } from "@/lib/api/show-error";
import { TRANSPORT_ERROR_MESSAGE } from "@/lib/api/transport-error";

import { verifySmsAction } from "@/app/actions/auth";
import { AppButton } from "@/components/common/ui/app-button";
import { AppFormField } from "@/components/common/ui/app-form-field";
import { AppInput } from "@/components/common/ui/app-input";
import {
  verifySmsSchema,
  type VerifySmsFormData,
  type VerifySmsFormInput,
} from "@/lib/schemas/auth";

export function VerifySmsForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<VerifySmsFormInput, unknown, VerifySmsFormData>({
    resolver: zodResolver(verifySmsSchema),

    defaultValues: {
      code: "",
    },
  });

  async function onSubmit(data: VerifySmsFormData) {
    const result = await verifySmsAction(data).catch(() => ({
      success: false as const,
      message: TRANSPORT_ERROR_MESSAGE,
      fieldErrors: undefined,
    }));

    if (result.success) {
      if (result.message) showSuccess(result.message);
      router.push("/login");
      return;
    }

    if (result.fieldErrors?.code) {
      setError("code", {
        type: "server",
        message: result.fieldErrors.code,
      });
    }

    showError(result.message);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <AppFormField
        label="کد تأیید"
        htmlFor="code"
        hint="کد ۶ رقمی ارسال‌شده در پیامک را وارد کنید."
        error={errors.code?.message}
        required
      >
        <AppInput
          id="code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          placeholder="000000"
          dir="ltr"
          className="text-center text-lg tracking-[0.3em]"
          invalid={Boolean(errors.code)}
          {...register("code")}
        />
      </AppFormField>

      <AppButton type="submit" loading={isSubmitting} className="w-full">
        تأیید شماره همراه
      </AppButton>
    </form>
  );
}
