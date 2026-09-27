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

export const workspaceNavigation: readonly WorkspaceNavigationSection[] = [
  {
    label: "نمای کلی",
    items: [{ href: "/dashboard", label: "داشبورد", icon: "dashboard" }],
  },
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
  workspaceNavigation.flatMap((section) =>
    section.items.map((item) => [item.href, item.label] as const),
  ),
);

export function getWorkspacePageTitle(path: string): string | undefined {
  return workspacePageTitles.get(path);
}
