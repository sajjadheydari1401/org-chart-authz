export interface IOrgUnit {
  id: number;
  name: string;
  parentId: number | null;
  children?: IOrgUnit[];
}
