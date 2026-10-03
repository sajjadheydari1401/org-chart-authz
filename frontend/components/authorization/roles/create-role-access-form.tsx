'use client';

import type { FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { AppButton } from '@/components/common/ui/app-button';
import { AppFormField } from '@/components/common/ui/app-form-field';
import { AppSelect } from '@/components/common/ui/app-select';
import { showError, showSuccess } from '@/lib/api/show-error';
import { createRoleAccessLink } from '@/services/authorization/role-management.service';
import type { Role } from '@/types/authorization/role';
import type {
  AccessRecord,
  CreateRoleAccessInput,
} from '@/types/authorization/role-management';

interface CreateRoleAccessFormProps {
  roles: readonly Role[];
  rolesLoading: boolean;
  availableAccesses: readonly AccessRecord[];
  accessesLoading: boolean;
  onSuccess: () => void | Promise<void>;
}

export function CreateRoleAccessForm({
  roles,
  rolesLoading,
  availableAccesses,
  accessesLoading,
  onSuccess,
}: CreateRoleAccessFormProps) {
  const createLinkMutation = useMutation({ mutationFn: createRoleAccessLink });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const input: CreateRoleAccessInput = {
      roleId: String(formData.get('roleId') ?? ''),
      accessId: String(formData.get('accessId') ?? ''),
    };

    try {
      await createLinkMutation.mutateAsync(input);
      form.reset();
      showSuccess('دسترسی به نقش اضافه شد.');
      await onSuccess();
    } catch (error) {
      showError(
        error instanceof Error ? error.message : 'افزودن دسترسی ناموفق بود.',
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <AppFormField label="نقش" htmlFor="role-access-role" required>
        <AppSelect
          id="role-access-role"
          name="roleId"
          options={roles.map((role) => ({
            value: role.id,
            label: role.farsiName || role.name,
          }))}
          placeholder={rolesLoading ? 'در حال دریافت نقش‌ها...' : 'انتخاب نقش'}
          disabled={rolesLoading || !roles.length}
          required
        />
      </AppFormField>
      <AppFormField label="دسترسی" htmlFor="role-access-access" required>
        <AppSelect
          id="role-access-access"
          name="accessId"
          options={availableAccesses.map((access) => ({
            value: access.id,
            label: `${access.methodName} · ${access.description}`,
          }))}
          placeholder={
            accessesLoading ? 'در حال دریافت دسترسی‌ها...' : 'انتخاب دسترسی'
          }
          disabled={accessesLoading || !availableAccesses.length}
          required
        />
      </AppFormField>
      <AppButton
        type="submit"
        loading={createLinkMutation.isPending}
        disabled={
          rolesLoading ||
          accessesLoading ||
          !roles.length ||
          !availableAccesses.length
        }
        className="w-full"
      >
        ثبت دسترسی
      </AppButton>
    </form>
  );
}
