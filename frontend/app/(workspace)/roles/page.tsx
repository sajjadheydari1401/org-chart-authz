import { notFound } from 'next/navigation';
import { RolesTabs } from '@/components/authorization/roles/roles-tabs';
import { getWorkspaceAccesses } from '@/lib/auth/workspace-access';
import { hasWorkspaceAccess } from '@/lib/workspace-navigation';

export default async function RolesPage() {
  const accesses = await getWorkspaceAccesses();
  if (!hasWorkspaceAccess('/roles', accesses)) notFound();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold text-foreground">نقش‌ها</h1>
      </header>
      <RolesTabs accesses={accesses} />
    </div>
  );
}
