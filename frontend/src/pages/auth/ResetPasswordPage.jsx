import React, { useState } from 'react';
import { ArrowLeft, Lock, Send, CheckCircle2 } from 'lucide-react';
import { MotionDiv } from '@/components/common/MotionWrapper';
import { GlassCard } from '@/components/common/GlassCard';
import AuthHeader from '@/components/auth/AuthHeader';
import CustomInput from '@/components/auth/CustomInput';
import CustomPassword from '@/components/auth/CustomPassword';
import { Button } from '@heroui/button';
import { Loader2 } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { useResetPasswordMutation } from '@/services/api';
import { useToast } from '@/components/common/Toast';

export const schema = z
  .object({
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters long')
      .max(16, 'Password cannot be more than 16 characters')
      .regex(/[0-9]/, 'Password requires a number')
      .regex(/[a-z]/, 'Password requires a lowercase letter')
      .regex(/[A-Z]/, 'Password requires an uppercase letter')
      .regex(/[^\w]/, 'Password requires a symbol'),
    confirmPassword: z.string({
      required_error: 'Confirm password is required',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export default function ResetPasswordPage() {
  const [resetPasswordApi, { isLoading: isResetting }] = useResetPasswordMutation();
  const toast = useToast();
  const navigate = useNavigate();
  const { token } = useParams();

  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const onSubmit = async (data) => {
    if (!token) {
      toast.error('Invalid or missing reset token.');
      return;
    }
    try {
      const payload = {
        password: data.password,
        confirmPassword: data.confirmPassword,
        token,
      };

      const resp = await resetPasswordApi(payload).unwrap();
      if (resp?.success) {
        setIsSuccess(true);
        toast.success(resp?.message || 'Password reset successfully.');
        reset();
      }
    } catch (error) {
      toast.error(error?.data?.error?.message || error?.data?.message || 'Failed to reset password');
    }
  };

  const isLoading = isSubmitting || isResetting;

  return (
    <MotionDiv className="flex h-full w-full flex-col items-center justify-center p-5">
      <GlassCard color={'#6366f1'} variant={'transparent'} className="w-full max-w-md space-y-5 py-6">
        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { type: 'spring', duration: 1 },
          }}
        >
          <AuthHeader />
          {!isSuccess && (
            <div className="my-6 text-center">
              <h2 className="text-center text-xl font-bold text-white">Create New Password</h2>
              <p className="text-slate-400">Please enter your new password below</p>
            </div>
          )}

          <div className="w-full max-w-md px-5 sm:px-10">
            {isSuccess ? (
              <div className="space-y-6 py-4 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/20">
                  <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Password Updated!</h3>
                <p className="leading-relaxed text-slate-400">Your password has been changed successfully. You can now login with your new credentials.</p>

                <Button
                  onPress={() => navigate('/auth/login')}
                  className="from-indigo via-pink to-purple mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r text-lg font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-indigo-500/50 active:scale-[0.98]"
                >
                  Go to Login
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="my-10 flex flex-col gap-5 border-slate-300 text-slate-300 sm:gap-7">
                  <CustomPassword disabled={isLoading} register={register} name="password" label="New Password" errors={errors} />

                  <CustomInput disabled={isLoading} register={register} errors={errors} type="password" name="confirmPassword" label="Confirm Password" icon={Lock} />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !isValid}
                  className="from-indigo via-pink to-purple my-5 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r text-lg font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-indigo-500/50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      Reset Password
                      <Send className="h-5 w-5" />
                    </>
                  )}
                </Button>

                <div className="mt-5 text-center">
                  <Link to={'/auth/Login'} className="flex items-center justify-center gap-2 text-sm font-bold text-slate-400 hover:underline">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Login
                  </Link>
                </div>
              </form>
            )}
          </div>
        </MotionDiv>
      </GlassCard>
    </MotionDiv>
  );
}
