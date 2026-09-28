import type { IManager } from '@/types/user';

export const managers: IManager[] = [
  {
    id: 20,
    name: 'آرمان نیک‌پی',
    email: 'arman.nikpay@example.com',
    mobile: '09120000020',
    department: { id: 101, name: 'مدیریت مجتمع' },
  },
  {
    id: 21,
    name: 'نرگس زمانی',
    email: 'narges.zamani@example.com',
    mobile: '09120000021',
    department: { id: 102, name: 'بهره‌برداری و نگهداری' },
  },
  {
    id: 22,
    name: 'سامان فرهمند',
    email: 'saman.farahmand@example.com',
    mobile: '09120000022',
    department: { id: 103, name: 'امور مالی و حسابداری' },
  },
  {
    id: 23,
    name: 'الهام رستگار',
    email: 'elham.rastegar@example.com',
    mobile: '09120000023',
    department: { id: 104, name: 'واحدهای تجاری و قراردادها' },
  },
  {
    id: 24,
    name: 'پیمان صادقی',
    email: 'peyman.sadeghi@example.com',
    mobile: '09120000024',
    department: { id: 105, name: 'خدمات عمومی و پارکینگ' },
  },
];
