"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { showError, showSuccess } from "@/lib/api/show-error";
import { TRANSPORT_ERROR_MESSAGE } from "@/lib/api/transport-error";

import { loginAction } from "@/app/actions/auth";
import { AppButton } from "@/components/common/ui/app-button";
import { AppFormField } from "@/components/common/ui/app-form-field";
import { AppInput } from "@/components/common/ui/app-input";
import {
  loginSchema,
  type LoginFormData,
  type LoginFormInput,
} from "@/lib/schemas/auth";

export function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInput, unknown, LoginFormData>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormData) {
    const result = await loginAction(data).catch(() => ({
      success: false as const,
      message: TRANSPORT_ERROR_MESSAGE,
    }));
    if (result.success) {
      if (result.message) showSuccess(result.message);
      router.push("/dashboard");
      return;
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
        label="رمز عبور"
        htmlFor="password"
        error={errors.password?.message}
        required
      >
        <AppInput
          id="password"
          type="password"
          autoComplete="current-password"
          invalid={Boolean(errors.password)}
          {...register("password")}
        />
      </AppFormField>

      <AppButton type="submit" loading={isSubmitting} className="w-full">
        ورود
      </AppButton>
    </form>
  );
}
