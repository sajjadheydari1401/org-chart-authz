'use client';

import { useState, type FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { AppButton } from '@/components/common/ui/app-button';
import { AppFormField } from '@/components/common/ui/app-form-field';
import { AppPagination } from '@/components/common/ui/app-pagination';
import { AppSelect } from '@/components/common/ui/app-select';
import { PAGE_SIZE_OPTIONS } from '@/constants/pagination';
import { showError, showSuccess } from '@/lib/api/show-error';
import { createRoleAssignment } from '@/services/authorization/role-management.service';
import type { PaginationMeta } from '@/types/api';
import type { Role } from '@/types/authorization/role';
import type { CreateRoleAssignmentInput } from '@/types/authorization/role-management';
import type { UserDirectoryRecord } from '@/types/user';

interface CreateRoleAssignmentFormProps {
  roles: readonly Role[];
  rolesLoading: boolean;
  users: readonly UserDirectoryRecord[];
  usersLoading: boolean;
  pagination?: PaginationMeta;
  userPage: number;
  userPageSize: number;
  isFetchingUsers: boolean;
  onUserPageChange: (page: number) => void;
  onUserPageSizeChange: (pageSize: number) => void;
  onSuccess: () => void | Promise<void>;
}

export function CreateRoleAssignmentForm({
  roles,
  rolesLoading,
  users,
  usersLoading,
  pagination,
  userPage,
  userPageSize,
  isFetchingUsers,
  onUserPageChange,
  onUserPageSizeChange,
  onSuccess,
}: CreateRoleAssignmentFormProps) {
  const [selectedUser, setSelectedUser] = useState<UserDirectoryRecord | null>(
    null,
  );
  const createAssignmentMutation = useMutation({
    mutationFn: createRoleAssignment,
  });
  const userOptions = [...users];

  if (
    selectedUser &&
    !userOptions.some((user) => user.id === selectedUser.id)
  ) {
    userOptions.unshift(selectedUser);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const input: CreateRoleAssignmentInput = {
      userId: String(formData.get('userId') ?? ''),
      roleId: String(formData.get('roleId') ?? ''),
    };

    try {
      await createAssignmentMutation.mutateAsync(input);
      form.reset();
      setSelectedUser(null);
      showSuccess('نقش با موفقیت به کاربر تخصیص داده شد.');
      await onSuccess();
    } catch (error) {
      showError(
        error instanceof Error ? error.message : 'تخصیص نقش ناموفق بود.',
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <AppFormField label="کاربر" htmlFor="assignment-user" required>
        <AppSelect
          id="assignment-user"
          name="userId"
          value={selectedUser?.id ?? ''}
          onChange={(event) => {
            const user = users.find(
              (item) => item.id === event.currentTarget.value,
            );
            setSelectedUser(user ?? null);
          }}
          options={userOptions.map((user) => ({
            value: user.id,
            label: `${user.username}${user.isManager ? ' · مدیر' : ''}`,
          }))}
          placeholder={
            usersLoading ? 'در حال دریافت کاربران...' : 'انتخاب کاربر'
          }
          disabled={usersLoading || !userOptions.length}
          required
        />
      </AppFormField>
      {pagination && pagination.total > userPageSize && (
        <AppPagination
          pagination={{
            ...pagination,
            current: userPage,
            pageSize: userPageSize,
          }}
          onPageChange={onUserPageChange}
          onPageSizeChange={onUserPageSizeChange}
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          disabled={isFetchingUsers}
        />
      )}
      <AppFormField label="نقش" htmlFor="assignment-role" required>
        <AppSelect
          id="assignment-role"
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
      <AppButton
        type="submit"
        loading={createAssignmentMutation.isPending}
        disabled={!selectedUser || rolesLoading || !roles.length}
        className="w-full"
      >
        ثبت تخصیص
      </AppButton>
    </form>
  );
}
