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
      eyebrow="SMS verification"
      title="Check your phone"
      description={<>We sent a verification code to your phone.</>}
      footer={
        <p className="text-sm leading-6 text-muted-foreground">
          The verification code is temporary. If it expires, return to sign up
          and request a new code.
        </p>
      }
    >
      <VerifySmsForm />
    </AuthCard>
  );
}
