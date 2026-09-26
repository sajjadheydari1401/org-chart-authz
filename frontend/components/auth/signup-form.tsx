"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { showError } from "@/lib/api/show-error";
import { TRANSPORT_ERROR_MESSAGE } from "@/lib/api/transport-error";

import { signupAction } from "@/app/actions/auth";
import { AppButton } from "@/components/common/ui/app-button";
import { AppFormField } from "@/components/common/ui/app-form-field";
import { AppInput } from "@/components/common/ui/app-input";
import {
  signupSchema,
  type SignupFormData,
  type SignupFormInput,
} from "@/lib/schemas/auth";

export function SignupForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormInput, unknown, SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      mobile: "",
    },
  });

  async function onSubmit(data: SignupFormData) {
    const result = await signupAction(data).catch(() => ({
      success: false as const,
      message: TRANSPORT_ERROR_MESSAGE,
      fieldErrors: undefined,
    }));

    if (result.success) {
      return;
    }

    const fieldErrors = result.fieldErrors;

    if (fieldErrors?.email) {
      setError("email", {
        type: "server",
        message: fieldErrors.email,
      });
    }

    if (fieldErrors?.username) {
      setError("username", {
        type: "server",
        message: fieldErrors.username,
      });
    }

    if (fieldErrors?.mobile) {
      setError("mobile", {
        type: "server",
        message: fieldErrors.mobile,
      });
    }

    if (fieldErrors?.password) {
      setError("password", {
        type: "server",
        message: fieldErrors.password,
      });
    }

    showError(result.message);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <AppFormField
        label="ایمیل"
        htmlFor="email"
        error={errors.email?.message}
        required
      >
        <AppInput
          id="email"
          type="email"
          dir="ltr"
          autoComplete="email"
          placeholder="you@example.com"
          invalid={Boolean(errors.email)}
          {...register("email")}
        />
      </AppFormField>

      <AppFormField
        label="نام کاربری"
        htmlFor="username"
        error={errors.username?.message}
        required
      >
        <AppInput
          id="username"
          type="text"
          autoComplete="username"
          placeholder="نام کاربری شما"
          invalid={Boolean(errors.username)}
          {...register("username")}
        />
      </AppFormField>

      <AppFormField
        label="شماره همراه"
        htmlFor="mobile"
        hint="شماره همراه ایران را وارد کنید؛ برای مثال ۰۹۱۲۳۴۵۶۷۸۹."
        error={errors.mobile?.message}
        required
      >
        <AppInput
          id="mobile"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="09123456789"
          dir="ltr"
          invalid={Boolean(errors.mobile)}
          {...register("mobile")}
        />
      </AppFormField>

      <AppFormField
        label="رمز عبور"
        htmlFor="password"
        hint="حداقل ۸ نویسه وارد کنید."
        error={errors.password?.message}
        required
      >
        <AppInput
          id="password"
          type="password"
          autoComplete="new-password"
          invalid={Boolean(errors.password)}
          {...register("password")}
        />
      </AppFormField>


      <AppButton type="submit" loading={isSubmitting} className="w-full">
        ایجاد حساب
      </AppButton>
    </form>
  );
}
