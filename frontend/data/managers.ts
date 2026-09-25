import type { IManager } from "@/types/user";

export const managers: IManager[] = [
  {
    id: 20,
    name: "محمد بهرامی",
    email: "mohammad.bahrami@example.com",
    department: { id: 10, name: "فنی و مهندسی" },
  },
  {
    id: 21,
    name: "سمیرا جعفری",
    email: "samira.jafari@example.com",
    department: { id: 11, name: "مالی" },
  },
  {
    id: 22,
    name: "مهدی شریفی",
    email: "mehdi.sharifi@example.com",
    department: { id: 12, name: "منابع انسانی" },
  },
];
