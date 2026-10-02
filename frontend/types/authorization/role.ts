export type RoleScopeMode = 'SELF' | 'DESCENDANTS';

export interface Role {
  id: string;
  providerId: string;
  unit_id: string;
  name: string;
  farsiName: string;
  description: string;
  scopeMode: RoleScopeMode;
}

export interface RolesResponse {
  roles: Role[];
}
