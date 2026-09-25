import { IOrgUnit } from "@/types/org-unit";

export const rawUnits: IOrgUnit[] = [
  { id: 1, name: "رئیس هیئت‌مدیره", parentId: null },

  { id: 2, name: "واحد مهندسی", parentId: 1 },
  { id: 3, name: "واحد مالی", parentId: 1 },
  { id: 4, name: "واحد منابع انسانی", parentId: 1 },

  { id: 5, name: "تیم فرانت‌اند", parentId: 2 },
  { id: 6, name: "تیم بک‌اند", parentId: 2 },
  { id: 7, name: "تیم دواپس", parentId: 2 },

  { id: 8, name: "تیم حسابداری", parentId: 3 },

  { id: 9, name: "تیم جذب و استخدام", parentId: 4 },
  { id: 10, name: "تیم روابط کارکنان", parentId: 4 },
];
