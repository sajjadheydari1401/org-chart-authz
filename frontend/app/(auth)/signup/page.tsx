import { AuthCard } from "@/components/auth/auth-card";
import { SignupForm } from "@/components/auth/signup-form";
import { AppLink } from "@/components/common/ui/app-link";

export default function SignupPage() {
  return (
    <AuthCard
      eyebrow="Create account"
      title="Get started"
      description={
        <>
          Enter your details. We&apos;ll verify your mobile number before
          activating your account.
        </>
      }
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Already have an account? <AppLink href="/login">Sign in</AppLink>
        </p>
      }
    >
      <SignupForm />
    </AuthCard>
  );
}
