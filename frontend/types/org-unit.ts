export interface OrgUnit {
  id: number;
  name: string;
  parentId: number | null;
  children?: OrgUnit[];
}
