import { GlassCard } from '@/components/common/GlassCard';
import { MotionDiv } from '@/components/common/MotionWrapper';
import { Button } from '@heroui/button';
import { FcGoogle } from 'react-icons/fc';
import { ArrowLeft, ArrowRight, Loader2, Lock, Mail } from 'lucide-react';
import { RiGithubLine } from 'react-icons/ri';
import { FaLinkedinIn } from 'react-icons/fa6';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User } from '@phosphor-icons/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomInput from '@/components/auth/CustomInput';
import CustomPassword from '@/components/auth/CustomPassword';
import AuthHeader from '@/components/auth/AuthHeader';
import SocialButton from '@/components/auth/SocialButton';
import { cn } from '@/lib/utils';

const registerSchema = z
  .object({
    name: z
      .string({ required_error: 'Name is required' })
      .trim()
      .min(3, 'Name must be at least 3 characters')
      .max(16, 'Name cannot be more than 16 characters long')
      .regex(/^[a-zA-Z]+( [a-zA-Z]+)*$/, 'Name can only contain alphabets'),

    email: z
      .string({ required_error: 'Email is required' })
      .email('Please enter a valid email address'),

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

export default function RegisterPage() {
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleNextStep = async (e) => {
    e.preventDefault();
    const isStepValid = await trigger(['name', 'email']);
    if (isStepValid) {
      setStep(2);
    }
  };

  const handleFinalSubmit = (data) => {
    console.log('✅ Final Validated Form Data:', data);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div key={'step1'} className="flex flex-col gap-7 border-slate-300 text-slate-300">
            <CustomInput
              register={register}
              errors={errors}
              name="name"
              label="Full Name"
              icon={User}
            />
            <CustomInput
              register={register}
              errors={errors}
              name="email"
              label="Email"
              icon={Mail}
            />
          </div>
        );
      case 2:
        return (
          <div
            key={'step2'}
            className="flex flex-col gap-5 border-slate-300 text-slate-300 sm:gap-7"
          >
            <CustomPassword register={register} name="password" label="Password" errors={errors} />
            <CustomInput
              register={register}
              errors={errors}
              type="password"
              name="confirmPassword"
              label="Confirm Password"
              icon={Lock}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <MotionDiv className="flex h-full w-full flex-col items-center justify-center p-5">
      <GlassCard
        color={'#6366f1'}
        variant={'transparent'}
        className="w-full max-w-md space-y-5 py-6"
      >
        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { type: 'spring', duration: 1 },
          }}
          className="space-y-4"
        >
          <AuthHeader />

          <div className="mt-4 mb-2 flex justify-center gap-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-500 ${step === i ? 'w-8 bg-indigo-500' : 'w-2 bg-slate-600'}`}
              />
            ))}
          </div>

          <div className="w-full max-w-md px-5 sm:px-10">
            <form
              onSubmit={step === 2 ? handleSubmit(handleFinalSubmit) : handleNextStep}
              className="space-y-5"
            >
              {renderStepContent()}

              <div className="mt-7 flex items-center gap-5">
                <Button
                  type="button"
                  onPress={() => setStep((prev) => Math.max(1, prev - 1))}
                  className={cn(
                    'border-border h-14 rounded-xl border text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70',
                    step === 1 ? 'hidden' : '',
                  )}
                >
                  <ArrowLeft className="h-5 w-5 sm:my-7" />
                </Button>

                <Button
                  type="submit"
                  className="from-indigo via-pink to-purple flex h-14 w-full flex-1 items-center justify-center gap-2 rounded-xl bg-linear-to-r text-lg font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-indigo-500/50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      {step === 2 ? 'Join Now' : 'Next'}
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>

              <div className="flex w-full items-center justify-between gap-3 text-sm text-slate-300">
                <span className="border-border w-full border"></span>
                <span>OR</span>
                <span className="border-border w-full border"></span>
              </div>

              <MotionDiv
                className="flex items-center justify-center gap-3"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: { staggerChildren: 0.3 },
                  },
                }}
              >
                <SocialButton href={''} icon={<FcGoogle className="text-2xl" />} />
                <SocialButton href={''} icon={<RiGithubLine className="text-2xl" />} />
                <SocialButton
                  href={''}
                  icon={<FaLinkedinIn className="text-2xl" />}
                  className={'text-blue-600'}
                />
              </MotionDiv>
            </form>

            <div className="mt-5 text-center">
              <p className="text-sm text-slate-400">
                By creating an account You agree to the{' '}
                <Link to={'/auth/login'} className="text-indigo font-bold hover:underline">
                  Terms and Conditions
                </Link>
              </p>
            </div>

            <div className="mt-5 text-center">
              <p className="text-sm text-slate-400">
                Already have an account?{' '}
                <Link to={'/auth/login'} className="text-indigo font-bold hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </MotionDiv>
      </GlassCard>
    </MotionDiv>
  );
}
