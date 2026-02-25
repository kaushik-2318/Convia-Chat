import { GlassCard } from '@/components/common/GlassCard';
import { MotionDiv } from '@/components/common/MotionWrapper';
import { Button } from '@heroui/button';
import { FcGoogle } from 'react-icons/fc';
import { ArrowLeft, ArrowRight, Loader2, Lock, Mail } from 'lucide-react';
import { RiGithubLine } from 'react-icons/ri';
import { FaLinkedinIn } from 'react-icons/fa6';
import React, { useRef, useState } from 'react';
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
import { useCheckEmailMutation, useRegisterMutation } from '@/services/api';
import { useToast } from '@/components/common/Toast';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setRegisterToken } from '@/redux/slice/authSlice';
import ReCAPTCHA from 'react-google-recaptcha';

const step1Schema = z.object({
  firstName: z
    .string({ required_error: 'First name is required' })
    .trim()
    .min(3, 'First name must be at least 3 characters')
    .max(16, 'First name cannot be more than 16 characters long')
    .regex(/^[a-zA-Z]+( [a-zA-Z]+)*$/, 'First name can only contain alphabets'),

  lastName: z
    .string({ required_error: 'Last name is required' })
    .trim()
    .min(3, 'Last name must be at least 3 characters')
    .max(16, 'Last name cannot be more than 16 characters long')
    .regex(/^[a-zA-Z]+( [a-zA-Z]+)*$/, 'Last name can only contain alphabets'),

  email: z.string({ required_error: 'Email is required' }).email('Please enter a valid email address'),
});

const step2Schema = step1Schema
  .extend({
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
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [checkEmail, { isLoading: isCheckingEmail }] = useCheckEmailMutation();
  const [registerUser, { isLoading: isRegistering }] = useRegisterMutation();
  const dispatch = useAppDispatch();
  const registerToken = useAppSelector((state) => state.auth.registerToken);
  const recaptchaV2Ref = useRef(null);

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(step === 1 ? step1Schema : step2Schema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleNextStep = async (e) => {
    e.preventDefault();
    const isStepValid = await trigger(['firstName', 'lastName', 'email']);
    if (!isStepValid) return;
    const data = getValues();
    try {
      const resp = await checkEmail(data).unwrap();
      if (resp?.status === 'success') {
        dispatch(setRegisterToken(resp?.data?.token));
        setStep(2);
        return;
      }
    } catch (err) {
      toast.error(err?.data?.error?.message);
      console.log(err);
    }
  };

  const handleFinalSubmit = async (data) => {
    const isFormValid = await trigger(['password', 'confirmPassword']);
    if (!isFormValid) return;
    let recaptchaToken;
    let payload;
    let resp;

    try {
      recaptchaToken = await recaptchaV2Ref.current.executeAsync();
      recaptchaV2Ref.current.reset();

      payload = {
        ...data,
        token: registerToken,
        recaptchaToken,
      };

      resp = await registerUser(payload).unwrap();

      if (resp?.status === 'success') {
        toast.success('Registration successful');
        setStep(1);
        return;
      }
    } catch (error) {
      toast.error(error?.data?.error?.message || 'Registration failed');
      console.log(error);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div key={'step1'} className="flex flex-col gap-7 border-slate-300 text-slate-300">
            <CustomInput register={register} errors={errors} name="firstName" label="First Name" icon={User} />
            <CustomInput register={register} errors={errors} name="lastName" label="Last Name" icon={User} />
            <CustomInput register={register} errors={errors} name="email" label="Email" icon={Mail} />
          </div>
        );
      case 2:
        return (
          <div key={'step2'} className="flex flex-col gap-5 border-slate-300 text-slate-300 sm:gap-7">
            <CustomPassword register={register} name="password" label="Password" errors={errors} />
            <CustomInput register={register} errors={errors} type="password" name="confirmPassword" label="Confirm Password" icon={Lock} />
          </div>
        );
      default:
        return null;
    }
  };

  const isLoading = isSubmitting || isCheckingEmail || isRegistering;

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
          className="space-y-4"
        >
          <AuthHeader />

          <div className="mt-4 mb-2 flex justify-center gap-2">
            {[1, 2].map((i) => (
              <div key={i} className={`h-2 rounded-full transition-all duration-500 ${step === i ? 'w-8 bg-indigo-500' : 'w-2 bg-slate-600'}`} />
            ))}
          </div>

          <div className="w-full max-w-md px-5 sm:px-10">
            <form onSubmit={step === 2 ? handleSubmit(handleFinalSubmit) : handleNextStep} className="space-y-5">
              {renderStepContent()}

              <ReCAPTCHA ref={recaptchaV2Ref} sitekey={import.meta.env.VITE_RECAPTCHA_CLIENT} size="invisible" />

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
                  isDisabled={isLoading || !isValid}
                  className="from-indigo via-pink to-purple flex h-14 w-full flex-1 items-center justify-center gap-2 rounded-xl bg-linear-to-r text-lg font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-indigo-500/50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoading ? (
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
                <SocialButton href={''} icon={<FaLinkedinIn className="text-2xl" />} className={'text-blue-600'} />
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
