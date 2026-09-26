import { IOrgUnit } from "@/types/org-unit";

export const rawUnits: IOrgUnit[] = [
  { id: 1, name: "رئیس هیئت‌مدیره", parentId: null, type: "root" },

  { id: 2, name: "واحد مهندسی", parentId: 1, type: "department" },
  { id: 3, name: "واحد مالی", parentId: 1, type: "department" },
  { id: 4, name: "واحد منابع انسانی", parentId: 1, type: "department" },

  { id: 5, name: "تیم فرانت‌اند", parentId: 2, type: "team" },
  { id: 6, name: "تیم بک‌اند", parentId: 2, type: "team" },
  { id: 7, name: "تیم دواپس", parentId: 2, type: "team" },

  { id: 8, name: "تیم حسابداری", parentId: 3, type: "team" },

  { id: 9, name: "تیم جذب و استخدام", parentId: 4, type: "team" },
  { id: 10, name: "تیم روابط کارکنان", parentId: 4, type: "team" },
];
