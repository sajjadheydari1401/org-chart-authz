export type OrgUnitType = 'MANAGEMENT' | 'DEPARTMENT' | 'TEAM';

export interface IOrgUnit {
  id: number;
  name: string;
  type: OrgUnitType;
  parentId: number | null;
  children?: IOrgUnit[];
}
