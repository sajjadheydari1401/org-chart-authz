export type WorkspaceIconKey =
  | "dashboard"
  | "building"
  | "users"
  | "contract"
  | "vacancy"
  | "parking"
  | "facility"
  | "maintenance"
  | "finance"
  | "payment"
  | "document"
  | "inbox"
  | "workflow"
  | "report"
  | "role";

export interface WorkspaceNavigationItem {
  href: string;
  label: string;
  icon: WorkspaceIconKey;
}

export interface WorkspaceNavigationSection {
  label: string;
  items: readonly WorkspaceNavigationItem[];
}

export interface WorkspaceBreadcrumb {
  label: string;
  href?: string;
}

export const workspaceDashboardItem: WorkspaceNavigationItem = {
  href: "/dashboard",
  label: "داشبورد",
  icon: "dashboard",
};

export const workspaceNavigation: readonly WorkspaceNavigationSection[] = [
  {
    label: "مدیریت مجتمع",
    items: [
      { href: "/org-units", label: "واحدهای مجتمع", icon: "building" },
      { href: "/owners-tenants", label: "مالکان و مستأجران", icon: "users" },
      { href: "/vacancies", label: "واحدهای خالی", icon: "vacancy" },
    ],
  },
  {
    label: "قراردادها",
    items: [
      { href: "/contracts", label: "مدیریت قراردادها", icon: "contract" },
      {
        href: "/contracts/renewals",
        label: "تمدید قراردادها",
        icon: "contract",
      },
      {
        href: "/contracts/history",
        label: "تاریخچه قراردادها",
        icon: "document",
      },
    ],
  },
  {
    label: "مالی",
    items: [
      { href: "/finance/charges", label: "شارژ و مطالبات", icon: "finance" },
      {
        href: "/finance/income-expenses",
        label: "درآمد و هزینه‌ها",
        icon: "payment",
      },
      { href: "/finance/cost-centers", label: "مراکز هزینه", icon: "finance" },
      {
        href: "/finance/payments",
        label: "پرداخت‌ها و تسویه",
        icon: "payment",
      },
    ],
  },
  {
    label: "عملیات و نگهداری",
    items: [
      { href: "/operations/parking", label: "پارکینگ", icon: "parking" },
      {
        href: "/operations/facilities",
        label: "تأسیسات و تجهیزات",
        icon: "facility",
      },
      {
        href: "/operations/maintenance",
        label: "تعمیر و نگهداری",
        icon: "maintenance",
      },
      {
        href: "/operations/work-orders",
        label: "درخواست‌های کار",
        icon: "workflow",
      },
    ],
  },
  {
    label: "اسناد و دبیرخانه",
    items: [
      { href: "/documents", label: "بایگانی اسناد", icon: "document" },
      { href: "/office/inbox", label: "نامه‌های وارده", icon: "inbox" },
      { href: "/office/outbox", label: "نامه‌های صادره", icon: "inbox" },
      { href: "/office/workflows", label: "گردش کار", icon: "workflow" },
      { href: "/office/meetings", label: "جلسات و مصوبات", icon: "document" },
    ],
  },
  {
    label: "مدیریت و گزارش‌ها",
    items: [
      { href: "/users", label: "کاربران", icon: "users" },
      { href: "/access/roles", label: "نقش‌ها و دسترسی‌ها", icon: "role" },
      { href: "/reports", label: "گزارش‌ها", icon: "report" },
    ],
  },
];

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
