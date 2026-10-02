import { AuthCard } from '@/components/auth/auth-card';
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <AuthCard
      eyebrow="خوش آمدید"
      title="ورود"
      description="برای ورود به فضای کاری، اطلاعات حساب خود را وارد کنید."
    >
      <LoginForm />
    </AuthCard>
  );
}
