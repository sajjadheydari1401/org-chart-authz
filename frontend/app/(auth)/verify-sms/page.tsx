import { redirect } from "next/navigation";

import { VerifySmsForm } from "@/components/auth/verify-sms-form";
import { AuthCard } from "@/components/auth/auth-card";
import { getPendingUsername } from "@/lib/auth/session";

export default async function VerifySmsPage() {
  const username = await getPendingUsername();

  if (!username) {
    redirect("/signup");
  }

  return (
    <AuthCard
      eyebrow="تأیید پیامکی"
      title="تأیید شماره همراه"
      description={<>کد تأیید به شماره همراه شما ارسال شد.</>}
      footer={
        <p className="text-sm leading-6 text-muted-foreground">
          کد تأیید مدت محدودی اعتبار دارد. اگر منقضی شد، به صفحه ثبت‌نام برگردید و کد جدیدی درخواست کنید.
        </p>
      }
    >
      <VerifySmsForm />
    </AuthCard>
  );
}
