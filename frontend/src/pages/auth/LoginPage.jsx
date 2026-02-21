import { GlassCard } from '@/components/common/GlassCard';
import { MotionDiv } from '@/components/common/MotionWrapper';
import { Button } from '@heroui/button';
import { FcGoogle } from 'react-icons/fc';
import { ArrowRight, Loader2, Mail } from 'lucide-react';
import { RiGithubLine } from 'react-icons/ri';
import { FaLinkedinIn } from 'react-icons/fa6';
import React from 'react';
import { Link } from 'react-router-dom';
import AuthHeader from '@/components/auth/AuthHeader';
import CustomInput from '@/components/auth/CustomInput';
import CustomPassword from '@/components/auth/CustomPassword';
import SocialButton from '@/components/auth/SocialButton';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';

export const loginSchema = z.object({
    email: z
        .string({ required_error: 'Email Required' })
        .email('Invalid Email'),

    password: z
        .string({ required_error: 'Password Required' })
        .min(8, 'Password must be at least 8 characters long')
        .regex(/[0-9]/, 'Password requires a number')
        .regex(/[a-z]/, 'Password requires a lowercase letter')
        .regex(/[A-Z]/, 'Password requires an uppercase letter')
        .regex(/[^\w]/, 'Password requires a symbol'),
});

export default function LoginPage() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(loginSchema),
        mode: 'onTouched',
        reValidateMode: 'onChange',
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = (data) => {
        console.log('✅ Final Validated Form Data:', data);
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
                >
                    <AuthHeader />
                    <div className="my-4">
                        <h2 className="text-center text-xl font-bold text-white">
                            Welcome Back{' '}
                            <span className="gradient-text">Cheif!</span>
                        </h2>
                    </div>

                    <div className="w-full max-w-md px-5 sm:px-10">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="flex flex-col gap-5 border-slate-300 text-slate-300 sm:gap-7">
                                <CustomInput
                                    register={register}
                                    errors={errors}
                                    name="email"
                                    label="Email"
                                    icon={Mail}
                                />
                                <CustomPassword
                                    register={register}
                                    errors={errors}
                                    name="password"
                                    label="Password"
                                />
                            </div>
                            <div className="mt-5 cursor-pointer text-right text-sm text-slate-500 italic duration-200 hover:text-slate-300 hover:underline">
                                <Link to="/auth/forgot-password">
                                    Forgot Password?
                                </Link>
                            </div>

                            <Button
                                type="submit"
                                className="from-indigo via-pink to-purple my-5 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r text-lg font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-indigo-500/50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight className="h-5 w-5" />
                                    </>
                                )}
                            </Button>

                            <div className="mb-3 flex w-full items-center justify-between gap-3 text-sm text-slate-300">
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
                                <SocialButton
                                    href={''}
                                    icon={<FcGoogle className="text-2xl" />}
                                />
                                <SocialButton
                                    href={''}
                                    icon={<RiGithubLine className="text-2xl" />}
                                />
                                <SocialButton
                                    href={''}
                                    icon={<FaLinkedinIn className="text-2xl" />}
                                    className={'text-blue-600'}
                                />
                            </MotionDiv>
                        </form>

                        <div className="mt-5 text-center">
                            <p className="text-sm text-slate-400">
                                New to Convia?{' '}
                                <Link
                                    to={'/auth/register'}
                                    className="text-indigo font-bold hover:underline"
                                >
                                    Sign Up
                                </Link>
                            </p>
                        </div>
                    </div>
                </MotionDiv>
            </GlassCard>
        </MotionDiv>
    );
}
