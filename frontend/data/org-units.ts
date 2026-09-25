import { OrgUnit } from "@/types/org-unit";

export const rawUnits: OrgUnit[] = [
  { id: 1, name: "Owner", parentId: null },
  { id: 2, name: "Deputy A", parentId: 1 },
  { id: 3, name: "Deputy B", parentId: 1 },
  { id: 4, name: "Engineering Department", parentId: 2 },
  { id: 5, name: "Finance Department", parentId: 2 },
  { id: 6, name: "HR Department", parentId: 3 },
  { id: 7, name: "Frontend Team", parentId: 4 },
  { id: 8, name: "Backend Team", parentId: 4 },
  { id: 9, name: "DevOps Team", parentId: 4 },
  { id: 10, name: "Accounting Team", parentId: 5 },
  { id: 11, name: "Recruitment Team", parentId: 6 },
  { id: 12, name: "Employee Relations Team", parentId: 6 },
];
