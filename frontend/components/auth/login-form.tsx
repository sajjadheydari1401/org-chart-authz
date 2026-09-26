"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

// import { loginAction } from "@/app/actions/auth";
import { AppButton } from "@/components/common/ui/app-button";
import { AppFormError } from "@/components/common/ui/app-form-error";
import { AppFormField } from "@/components/common/ui/app-form-field";
import { AppInput } from "@/components/common/ui/app-input";
import {
  loginSchema,
  type LoginFormData,
  type LoginFormInput,
} from "@/lib/schemas/auth";

export function LoginForm() {
  const [formError, setFormError] = useState<string | undefined>();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInput, unknown, LoginFormData>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormData) {
    // setFormError(undefined);

    // const result = await loginAction(data);

    // if (result.success) {
    //   return;
    // }

    // const fieldErrors = result.fieldErrors;

    // if (fieldErrors?.email) {
    //   setError("email", {
    //     type: "server",
    //     message: fieldErrors.email,
    //   });
    // }

    // if (fieldErrors?.password) {
    //   setError("password", {
    //     type: "server",
    //     message: fieldErrors.password,
    //   });
    // }

    // setFormError(result.message);
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

      {formError && (
        <div className="rounded-lg border border-destructive bg-destructive-subtle px-4 py-3">
          <AppFormError message={formError} />
        </div>
      )}

      <AppButton type="submit" loading={isSubmitting} className="w-full">
        ورود
      </AppButton>
    </form>
  );
}
