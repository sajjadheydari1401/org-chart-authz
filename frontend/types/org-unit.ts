export type OrgUnitType = 'MANAGEMENT' | 'DEPARTMENT' | 'TEAM';

export interface IOrgUnit {
  id: string;
  name: string;
  type: OrgUnitType;
  parentId: string | null;
}
