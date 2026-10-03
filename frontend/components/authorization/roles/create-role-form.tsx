'use client';

import type { FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { AppButton } from '@/components/common/ui/app-button';
import { AppFormField } from '@/components/common/ui/app-form-field';
import { AppInput } from '@/components/common/ui/app-input';
import { AppSelect } from '@/components/common/ui/app-select';
import { AppTextarea } from '@/components/common/ui/app-textarea';
import { showError, showSuccess } from '@/lib/api/show-error';
import { createRole } from '@/services/authorization/roles/roles.service';
import type { CreateRoleInput } from '@/types/authorization/role-management';
import type { IOrgUnit } from '@/types/org-unit';

interface CreateRoleFormProps {
  units: readonly IOrgUnit[];
  unitsLoading: boolean;
  onSuccess: () => void | Promise<void>;
}

export function CreateRoleForm({
  units,
  unitsLoading,
  onSuccess,
}: CreateRoleFormProps) {
  const createRoleMutation = useMutation({ mutationFn: createRole });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const scopeMode = formData.get('scopeMode');
    if (scopeMode !== 'SELF' && scopeMode !== 'DESCENDANTS') return;

    const input: CreateRoleInput = {
      name: String(formData.get('name') ?? ''),
      farsiName: String(formData.get('farsiName') ?? ''),
      description: String(formData.get('description') ?? ''),
      unitId: String(formData.get('unitId') ?? ''),
      scopeMode,
    };

    try {
      await createRoleMutation.mutateAsync(input);
      form.reset();
      showSuccess('نقش با موفقیت ایجاد شد.');
      await onSuccess();
    } catch (error) {
      showError(
        error instanceof Error ? error.message : 'ایجاد نقش ناموفق بود.',
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <AppFormField label="نام انگلیسی" htmlFor="role-name" required>
        <AppInput id="role-name" name="name" required maxLength={100} />
      </AppFormField>
      <AppFormField label="نام فارسی" htmlFor="role-farsi-name" required>
        <AppInput
          id="role-farsi-name"
          name="farsiName"
          required
          maxLength={255}
        />
      </AppFormField>
      <AppFormField label="واحد" htmlFor="role-unit" required>
        <AppSelect
          id="role-unit"
          name="unitId"
          options={units.map((unit) => ({ value: unit.id, label: unit.name }))}
          placeholder={unitsLoading ? 'در حال دریافت واحدها...' : 'انتخاب واحد'}
          disabled={unitsLoading || !units.length}
          required
        />
      </AppFormField>
      <AppFormField label="محدوده نقش" htmlFor="role-scope" required>
        <AppSelect
          id="role-scope"
          name="scopeMode"
          options={[
            { value: 'SELF', label: 'فقط همین واحد' },
            { value: 'DESCENDANTS', label: 'این واحد و زیرمجموعه‌ها' },
          ]}
          defaultValue="DESCENDANTS"
          required
        />
      </AppFormField>
      <AppFormField label="توضیحات" htmlFor="role-description" required>
        <AppTextarea
          id="role-description"
          name="description"
          rows={3}
          required
        />
      </AppFormField>
      <AppButton
        type="submit"
        loading={createRoleMutation.isPending}
        disabled={unitsLoading || !units.length}
        className="w-full"
      >
        ذخیره نقش
      </AppButton>
    </form>
  );
}
