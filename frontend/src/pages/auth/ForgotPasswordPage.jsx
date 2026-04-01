import React, { useState, useRef } from 'react';
import { ArrowLeft, Mail, Send } from 'lucide-react';
import { MotionDiv } from '@/components/common/MotionWrapper';
import { GlassCard } from '@/components/common/GlassCard';
import AuthHeader from '@/components/auth/AuthHeader';
import CustomInput from '@/components/auth/CustomInput';
import { Button } from '@heroui/button';
import { Loader2 } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { useForgotPasswordMutation } from '@/services/api';
import ReCAPTCHA from 'react-google-recaptcha';
import { useToast } from '@/components/common/Toast';

export const schema = z.object({
  email: z.string({ required_error: 'Email Required' }).email('Invalid Email'),
});

export default function ForgotPasswordPage() {
  const [forgotPassword, { isLoading: isForgotPasswordLoading }] = useForgotPasswordMutation();
  const recaptchaV2Ref = useRef(null);
  const toast = useToast();
  const location = useLocation();

  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      email: location?.state?.email || '',
    },
  });

  const onSubmit = async (data) => {
    try {
      //  #Captch
      // const recaptchaToken = await recaptchaV2Ref.current.executeAsync();
      const payload = {
        ...data,
        //  #Captch
        recaptchaToken: '',
      };

      const resp = await forgotPassword(payload).unwrap();
      if (resp?.success) {
        setSubmittedEmail(data.email);
        setIsSuccess(true);
        toast.success(resp?.message || 'Reset link sent successfully.');
        reset();
      }
    } catch (error) {
      toast.error(error?.data?.error?.message || 'Something went wrong');
      reset();
    }
  };

  const isLoading = isSubmitting || isForgotPasswordLoading;

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
              <h2 className="text-center text-xl font-bold text-white">Reset Password</h2>
              <p className="text-slate-400">We'll help you get back into your account</p>
            </div>
          )}

          <div className="w-full max-w-md px-5 sm:px-10">
            {isSuccess ? (
              <div className="space-y-6 py-4 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/20">
                  <Send className="h-8 w-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Check your email</h3>
                <p className="leading-relaxed text-slate-400">
                  We've sent a password reset link to <br />
                  <span className="font-medium text-slate-200">{submittedEmail}</span>
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="my-10 flex flex-col gap-5 border-slate-300 text-slate-300 sm:gap-7">
                  <CustomInput register={register} errors={errors} name="email" label="Email" icon={Mail} disabled={isLoading} />
                </div>

                {/* #Captch */}
                {/* <ReCAPTCHA ref={recaptchaV2Ref} sitekey={import.meta.env.VITE_RECAPTCHA_CLIENT} size="invisible" /> */}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="from-indigo via-pink to-purple my-5 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r text-lg font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-indigo-500/50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      Send Reset Link
                      <Send className="h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            )}

            <div className="mt-5 text-center">
              <Link to={'/auth/Login'} className="flex items-center justify-center gap-2 text-sm font-bold text-slate-400 hover:underline">
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </Link>
            </div>
          </div>
        </MotionDiv>
      </GlassCard>
    </MotionDiv>
  );
}
