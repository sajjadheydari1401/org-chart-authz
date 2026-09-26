import { AuthCard } from "@/components/auth/auth-card";
import { SignupForm } from "@/components/auth/signup-form";
import { AppLink } from "@/components/common/ui/app-link";

export default function SignupPage() {
  return (
    <AuthCard
      eyebrow="ایجاد حساب"
      title="ثبت‌نام"
      description={
        <>
          اطلاعات خود را وارد کنید. پیش از فعال‌سازی حساب، شماره همراه شما را تأیید می‌کنیم.
        </>
      }
      footer={
        <p className="text-center text-sm text-muted-foreground">
          قبلاً ثبت‌نام کرده‌اید؟ <AppLink href="/login">ورود</AppLink>
        </p>
      }
    >
      <SignupForm />
    </AuthCard>
  );
}
