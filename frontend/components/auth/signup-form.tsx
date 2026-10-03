'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { showError, showSuccess } from '@/lib/api/show-error';
import { TRANSPORT_ERROR_MESSAGE } from '@/lib/api/transport-error';

import { registerWithUsernamePasswordAction } from '@/app/actions/auth';
import { AppButton } from '@/components/common/ui/app-button';
import { AppCombobox } from '@/components/common/ui/app-combobox/app-combobox';
import { AppControlledFormField } from '@/components/common/ui/app-controlled-form-field';
import { AppCheckbox } from '@/components/common/ui/app-checkbox';
import { AppFormField } from '@/components/common/ui/app-form-field';
import { AppInput } from '@/components/common/ui/app-input';
import { useRoles } from '@/hooks/authorization/use-roles';
import {
  signupSchema,
  type SignupFormData,
  type SignupFormInput,
} from '@/lib/schemas/auth';

export function AddUserForm({ onSuccess }: { onSuccess: () => void }) {
  const {
    data: roles,
    isError: rolesFailed,
    isPending: rolesLoading,
  } = useRoles();

  const roleOptions = (roles ?? []).map((role) => ({
    label: role.farsiName,
    value: role.name,
  }));

  const roleHint = rolesLoading
    ? 'در حال دریافت نقش‌ها...'
    : rolesFailed
      ? 'دریافت فهرست نقش‌ها ناموفق بود.'
      : roleOptions.length === 0
        ? 'نقشی برای انتخاب در دسترس نیست.'
        : undefined;

  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormInput, unknown, SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      role: '',
      username: '',
      password: '',
      mobile: '',
      isManager: false,
    },
  });

  async function onSubmit(data: SignupFormData) {
    const result = await registerWithUsernamePasswordAction(data).catch(() => ({
      success: false as const,
      message: TRANSPORT_ERROR_MESSAGE,
      fieldErrors: undefined,
    }));

    if (result.success) {
      if (result.message) showSuccess(result.message);
      onSuccess();
      return;
    }

    const fieldErrors = result.fieldErrors;

    if (fieldErrors?.email) {
      setError('email', {
        type: 'server',
        message: fieldErrors.email,
      });
    }

    if (fieldErrors?.role) {
      setError('role', {
        type: 'server',
        message: fieldErrors.role,
      });
    }

    if (fieldErrors?.username) {
      setError('username', {
        type: 'server',
        message: fieldErrors.username,
      });
    }

    if (fieldErrors?.mobile) {
      setError('mobile', {
        type: 'server',
        message: fieldErrors.mobile,
      });
    }

    if (fieldErrors?.password) {
      setError('password', {
        type: 'server',
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
          {...register('email')}
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
          {...register('username')}
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
          {...register('mobile')}
        />
      </AppFormField>

      <AppControlledFormField
        label="نقش"
        htmlFor="role"
        hint={roleHint}
        error={errors.role?.message}
        required
        name="role"
        control={control}
        render={({ field, fieldState }) => (
          <AppCombobox
            id="role"
            options={roleOptions}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            placeholder="انتخاب نقش"
            emptyMessage="نقشی با این نام پیدا نشد."
            disabled={rolesLoading || roleOptions.length === 0}
            invalid={fieldState.invalid}
          />
        )}
      />

      <AppFormField label="مدیر است" htmlFor="isManager">
        <AppCheckbox id="isManager" {...register('isManager')} />
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
          {...register('password')}
        />
      </AppFormField>

      <AppButton type="submit" loading={isSubmitting} className="w-full">
        افزودن کاربر
      </AppButton>
    </form>
  );
}
