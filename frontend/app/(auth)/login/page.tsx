import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";
import { AppLink } from "@/components/common/ui/app-link";

export default function LoginPage() {
  return (
    <AuthCard
      eyebrow="خوش آمدید"
      title="ورود"
      description="برای ورود به فضای کاری، اطلاعات حساب خود را وارد کنید."
      footer={
        <p className="text-center text-sm text-muted-foreground">
          حساب کاربری ندارید؟{" "}
          <AppLink href="/signup">ایجاد حساب</AppLink>
        </p>
      }
    >
      <LoginForm />
    </AuthCard>
  );
}
