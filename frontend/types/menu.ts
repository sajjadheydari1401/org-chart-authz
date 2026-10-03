export type WorkspaceIconKey =
  | 'dashboard'
  | 'building'
  | 'orgChart'
  | 'users'
  | 'contract'
  | 'vacancy'
  | 'parking'
  | 'facility'
  | 'maintenance'
  | 'finance'
  | 'payment'
  | 'document'
  | 'inbox'
  | 'workflow'
  | 'report'
  | 'role'
  | 'access';

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
