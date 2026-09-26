import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

export const metadata: Metadata = {
  title: "چارت سازمانی سیمرغ",
  description: "مدیریت ساختار سازمانی، کاربران، نقش‌ها و دسترسی‌ها",
};

const peyda = localFont({
  src: "../public/fonts/Peyda-Regular.ttf",
  variable: "--font-peyda-local",
  display: "swap",
});

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      dir="rtl"
      lang="fa"
      className={`${peyda.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
