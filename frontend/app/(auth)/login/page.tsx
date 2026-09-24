import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";
import { AppLink } from "@/components/common/ui/app-link";

export default function LoginPage() {
  return (
    <AuthCard
      eyebrow="Welcome back"
      title="Sign in"
      description="Enter your account details to continue to your workspace."
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <AppLink href="/signup">Create account</AppLink>
        </p>
      }
    >
      <LoginForm />
    </AuthCard>
  );
}
