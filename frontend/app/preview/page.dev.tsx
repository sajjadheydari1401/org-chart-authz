import type { Metadata } from "next";

import { ComponentShowcase } from "@/components/preview/component-showcase";

export const metadata: Metadata = {
  title: "پیش‌نمایش اجزای رابط | چارت سازمانی سیمرغ",
  description: "کاتالوگ تعاملی اجزای رابط و رنگ‌های پوسته",
};

export default function PreviewPage() {
  return <ComponentShowcase />;
}