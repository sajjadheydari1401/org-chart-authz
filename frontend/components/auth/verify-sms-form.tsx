"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { verifySmsAction } from "@/app/actions/auth";
import { AppButton } from "@/components/common/ui/app-button";
import { AppFormError } from "@/components/common/ui/app-form-error";
import { AppFormField } from "@/components/common/ui/app-form-field";
import { AppInput } from "@/components/common/ui/app-input";
import {
  verifySmsSchema,
  type VerifySmsFormData,
  type VerifySmsFormInput,
} from "@/lib/schemas/auth";

export function VerifySmsForm() {
  const [formError, setFormError] = useState<string | undefined>();

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
    setFormError(undefined);

    const result = await verifySmsAction(data);

    if (result.success) {
      return;
    }

    if (result.fieldErrors?.code) {
      setError("code", {
        type: "server",
        message: result.fieldErrors.code,
      });
    }

    setFormError(result.message);
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

      {formError && (
        <div className="rounded-lg border border-destructive bg-destructive-subtle px-4 py-3">
          <AppFormError message={formError} />
        </div>
      )}

      <AppButton type="submit" loading={isSubmitting} className="w-full">
        تأیید شماره همراه
      </AppButton>
    </form>
  );
}
