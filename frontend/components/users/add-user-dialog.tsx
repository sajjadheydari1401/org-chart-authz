'use client';

import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { AddUserForm } from '@/components/auth/signup-form';
import { VerifySmsForm } from '@/components/auth/verify-sms-form';
import { AppDialog } from '@/components/common/ui/app-dialog';
import { AppTableActions } from '@/components/common/ui/app-table/AppTableActions';

export function AddUserDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'details' | 'verification'>('details');

  function completeVerification() {
    setOpen(false);
    setStep('details');
    router.refresh();
  }

  return (
    <>
      <AppTableActions
        title="افزودن کاربر"
        onClick={() => setOpen(true)}
        icon={<UserPlus />}
      />
      <AppDialog
        open={open}
        onOpenChange={setOpen}
        title={step === 'details' ? 'افزودن کاربر' : 'تأیید شماره همراه'}
        description={
          step === 'details'
            ? 'مرحله ۱ از ۲ · اطلاعات کاربر جدید را وارد کنید.'
            : 'مرحله ۲ از ۲ · کد پیامک‌شده را برای فعال‌سازی کاربر وارد کنید.'
        }
        size="lg"
      >
        {step === 'details' ? (
          <AddUserForm onSuccess={() => setStep('verification')} />
        ) : (
          <VerifySmsForm onSuccess={completeVerification} />
        )}
      </AppDialog>
    </>
  );
}
