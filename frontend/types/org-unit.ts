export type OrgUnitType = "root" | "department" | "team";

export interface IOrgUnit {
  id: number;
  name: string;
  type: OrgUnitType;
  parentId: number | null;
  children?: IOrgUnit[];
}
