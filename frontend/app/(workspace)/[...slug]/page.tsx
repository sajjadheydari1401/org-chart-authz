import { notFound } from 'next/navigation';

import { requireWorkspaceAccess } from '@/lib/auth/workspace-access';
import { getWorkspacePageTitle } from '@/lib/workspace-navigation';

// Show a title for menu links that do not have their own page yet.
export default async function WorkspacePlaceholderPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const path = `/${slug.join('/')}`;
  const title = getWorkspacePageTitle(path);

  if (!title) notFound();
  await requireWorkspaceAccess(path);

  return <h1 className="text-2xl font-semibold text-foreground">{title}</h1>;
}
