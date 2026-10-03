import { AddUserDialog } from '@/components/users/add-user-dialog';
import { UsersTabs } from '@/components/users/users-tabs';
import { requireWorkspaceAccess } from '@/lib/auth/workspace-access';

export default async function UsersPage() {
  await requireWorkspaceAccess('/users');

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
          کاربران
        </h1>
        <AddUserDialog />
      </header>
      <UsersTabs />
    </div>
  );
}
