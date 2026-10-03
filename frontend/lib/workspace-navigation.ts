import {
  WorkspaceNavigationItem,
  WorkspaceNavigationSection,
  WorkspaceBreadcrumb,
} from '@/types/menu';
import type {
  AccessRequirement,
  EffectiveAccess,
} from '@/types/authorization/access';

export const workspaceDashboardItem: WorkspaceNavigationItem = {
  href: '/dashboard',
  label: 'داشبورد',
  icon: 'dashboard',
};

export const workspaceNavigation: readonly WorkspaceNavigationSection[] = [
  {
    label: 'مدیریت مجتمع',
    items: [
      { href: '/org-units', label: 'واحدهای مجتمع', icon: 'building' },
      { href: '/organization-chart', label: 'چارت مجتمع', icon: 'orgChart' },
      { href: '/users', label: 'کاربران', icon: 'users' },
      { href: '/roles', label: 'نقش‌ها', icon: 'role' },
      { href: '/accesses', label: 'دسترسی‌ها', icon: 'access' },
      { href: '/owners-tenants', label: 'مالکان و مستأجران', icon: 'users' },
      { href: '/vacancies', label: 'واحدهای خالی', icon: 'vacancy' },
    ],
  },
  {
    label: 'قراردادها',
    items: [
      { href: '/contracts', label: 'مدیریت قراردادها', icon: 'contract' },
      {
        href: '/contracts/renewals',
        label: 'تمدید قراردادها',
        icon: 'contract',
      },
      {
        href: '/contracts/history',
        label: 'تاریخچه قراردادها',
        icon: 'document',
      },
    ],
  },
  {
    label: 'مالی',
    items: [
      { href: '/finance/charges', label: 'شارژ و مطالبات', icon: 'finance' },
      {
        href: '/finance/income-expenses',
        label: 'درآمد و هزینه‌ها',
        icon: 'payment',
      },
      { href: '/finance/cost-centers', label: 'مراکز هزینه', icon: 'finance' },
      {
        href: '/finance/payments',
        label: 'پرداخت‌ها و تسویه',
        icon: 'payment',
      },
    ],
  },
  {
    label: 'عملیات و نگهداری',
    items: [
      { href: '/operations/parking', label: 'پارکینگ', icon: 'parking' },
      {
        href: '/operations/facilities',
        label: 'تأسیسات و تجهیزات',
        icon: 'facility',
      },
      {
        href: '/operations/maintenance',
        label: 'تعمیر و نگهداری',
        icon: 'maintenance',
      },
      {
        href: '/operations/work-orders',
        label: 'درخواست‌های کار',
        icon: 'workflow',
      },
    ],
  },
  {
    label: 'اسناد و دبیرخانه',
    items: [
      { href: '/documents', label: 'بایگانی اسناد', icon: 'document' },
      { href: '/office/inbox', label: 'نامه‌های وارده', icon: 'inbox' },
      { href: '/office/outbox', label: 'نامه‌های صادره', icon: 'inbox' },
      { href: '/office/workflows', label: 'گردش کار', icon: 'workflow' },
      { href: '/office/meetings', label: 'جلسات و مصوبات', icon: 'document' },
    ],
  },
  {
    label: 'مدیریت و گزارش‌ها',
    items: [{ href: '/reports', label: 'گزارش‌ها', icon: 'report' }],
  },
];

const pageAccessRequirements: Record<string, AccessRequirement> = {
  '/org-units': { route: '/units', methodName: 'GET' },
  '/organization-chart': { route: '/units', methodName: 'GET' },
  '/users': { route: '/users', methodName: 'GET' },
  '/roles': { route: '/roles', methodName: 'GET' },
  '/accesses': { route: '/accesses', methodName: 'GET' },
};

const rolesSectionReadRequirements: AccessRequirement[] = [
  { route: '/roles', methodName: 'GET' },
  { route: '/role-accesses/role-accesses', methodName: 'GET' },
  { route: '/role-assignments', methodName: 'GET' },
];

export function getWorkspaceAccessRequirement(href: string): AccessRequirement {
  return (
    pageAccessRequirements[href] ?? {
      route: href,
      methodName: 'GET',
    }
  );
}

export function hasWorkspaceAccess(
  href: string,
  accesses: readonly EffectiveAccess[],
): boolean {
  if (href === workspaceDashboardItem.href) return accesses.length > 0;
  if (href === '/roles') {
    return rolesSectionReadRequirements.some((requirement) =>
      hasRequiredAccess(requirement, accesses),
    );
  }

  const requiredAccess = getWorkspaceAccessRequirement(href);
  return hasRequiredAccess(requiredAccess, accesses);
}

export function hasRequiredAccess(
  requiredAccess: AccessRequirement,
  accesses: readonly EffectiveAccess[],
): boolean {
  return accesses.some(
    (access) =>
      access.route === requiredAccess.route &&
      access.methodName === requiredAccess.methodName &&
      access.unitIds.length > 0,
  );
}

export function getVisibleWorkspaceNavigation(
  accesses: readonly EffectiveAccess[],
): WorkspaceNavigationSection[] {
  return workspaceNavigation
    .map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        hasWorkspaceAccess(item.href, accesses),
      ),
    }))
    .filter((section) => section.items.length > 0);
}

const workspacePageTitles = new Map(
  [
    workspaceDashboardItem,
    ...workspaceNavigation.flatMap((section) => section.items),
  ].map((item) => [item.href, item.label] as const),
);

export function getWorkspacePageTitle(path: string): string | undefined {
  return workspacePageTitles.get(path);
}

export function getWorkspaceBreadcrumbs(path: string): WorkspaceBreadcrumb[] {
  if (path === workspaceDashboardItem.href) {
    return [{ label: workspaceDashboardItem.label }];
  }

  const section = workspaceNavigation.find((group) =>
    group.items.some((item) => item.href === path),
  );
  const currentItem = section?.items.find((item) => item.href === path);
  if (!section || !currentItem) return [];

  const parentItems = section.items
    .filter((item) => item.href !== path && path.startsWith(`${item.href}/`))
    .sort((left, right) => left.href.length - right.href.length);

  return [
    { label: workspaceDashboardItem.label, href: workspaceDashboardItem.href },
    { label: section.label },
    ...parentItems.map(({ label, href }) => ({ label, href })),
    { label: currentItem.label },
  ];
}
