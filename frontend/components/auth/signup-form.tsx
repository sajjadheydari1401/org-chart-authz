"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

// import { signupAction } from "@/app/actions/auth";
import { AppButton } from "@/components/common/ui/app-button";
import { AppFormError } from "@/components/common/ui/app-form-error";
import { AppFormField } from "@/components/common/ui/app-form-field";
import { AppInput } from "@/components/common/ui/app-input";
import {
  signupSchema,
  type SignupFormData,
  type SignupFormInput,
} from "@/lib/schemas/auth";

export function SignupForm() {
  const [formError, setFormError] = useState<string | undefined>();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormInput, unknown, SignupFormData>({
    resolver: zodResolver(signupSchema),

    defaultValues: {
      email: "",
      password: "",
      mobile: "",
    },
  });

  async function onSubmit(data: SignupFormData) {
    // setFormError(undefined);

    // const result = await signupAction(data);

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

    // if (fieldErrors?.mobile) {
    //   setError("mobile", {
    //     type: "server",
    //     message: fieldErrors.mobile,
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
        label="Email"
        htmlFor="email"
        error={errors.email?.message}
        required
      >
        <AppInput
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          invalid={Boolean(errors.email)}
          {...register("email")}
        />
      </AppFormField>

      <AppFormField
        label="Mobile"
        htmlFor="mobile"
        hint="Use an Iranian mobile number, for example 09123456789."
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
        label="Password"
        htmlFor="password"
        hint="Use at least 8 characters."
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

      {formError && (
        <div className="rounded-lg border border-destructive bg-destructive-subtle px-4 py-3">
          <AppFormError message={formError} />
        </div>
      )}

      <AppButton type="submit" loading={isSubmitting} className="w-full">
        Create account
      </AppButton>
    </form>
  );
}
