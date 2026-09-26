"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { showError, showSuccess } from "@/lib/api/show-error";
import { useAuthUserStore } from "@/lib/auth/user-store";
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
  const setUser = useAuthUserStore((state) => state.setUser);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInput, unknown, LoginFormData>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormData) {
    const result = await loginAction(data).catch(() => ({
      success: false as const,
      message: TRANSPORT_ERROR_MESSAGE,
      fieldErrors: undefined,
    }));
    if (result.success) {
      if (result.user) setUser(result.user);
      if (result.message) showSuccess(result.message);
      router.push("/dashboard");
      return;
    }

    if (result.fieldErrors?.username) {
      setError("username", {
        type: "server",
        message: result.fieldErrors.username,
      });
    }

    if (result.fieldErrors?.password) {
      setError("password", {
        type: "server",
        message: result.fieldErrors.password,
      });
    }

    showError(result.message);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <AppFormField
        label="نام کاربری"
        htmlFor="username"
        error={errors.username?.message}
        required
      >
        <AppInput
          id="username"
          type="text"
          dir="ltr"
          autoComplete="username"
          placeholder="نام کاربری شما"
          invalid={Boolean(errors.username)}
          {...register("username")}
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
