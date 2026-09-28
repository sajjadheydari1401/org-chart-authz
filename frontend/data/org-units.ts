import { IOrgUnit } from '@/types/org-unit';

export const rawUnits: IOrgUnit[] = [
  { id: 101, name: 'مدیریت مجتمع', parentId: null, type: 'root' },

  { id: 102, name: 'بهره‌برداری و نگهداری', parentId: 101, type: 'department' },
  { id: 103, name: 'امور مالی و حسابداری', parentId: 101, type: 'department' },
  {
    id: 104,
    name: 'واحدهای تجاری و قراردادها',
    parentId: 101,
    type: 'department',
  },
  { id: 105, name: 'خدمات عمومی و پارکینگ', parentId: 101, type: 'department' },

  { id: 1, name: 'تعمیر و نگهداری تأسیسات', parentId: 102, type: 'team' },
  { id: 2, name: 'پشتیبانی قرارداد و اجاره', parentId: 104, type: 'team' },
  { id: 3, name: 'پارکینگ و کنترل تردد', parentId: 105, type: 'team' },
  { id: 4, name: 'حسابداری و دریافت‌ها', parentId: 103, type: 'team' },
  { id: 5, name: 'روابط مستأجران', parentId: 104, type: 'team' },
  { id: 6, name: 'پذیرش و خدمات مراجعه‌کنندگان', parentId: 105, type: 'team' },
];
