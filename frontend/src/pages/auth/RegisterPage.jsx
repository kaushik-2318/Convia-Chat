import { GlassCard } from '@/components/common/GlassCard';
import { Logo } from '@/components/common/Logo';
import { MotionDiv } from '@/components/common/MotionWrapper';
import { Button } from '@heroui/button';
import { FcGoogle } from 'react-icons/fc';
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import { RiGithubLine } from 'react-icons/ri';
import { FaLinkedinIn } from 'react-icons/fa6';
import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { User } from '@phosphor-icons/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';


const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [step, setStep] = useState(1);

    const { register, handleSubmit, trigger, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(registerSchema),
        mode: "onTouched",
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
        }
    });

    const handleToggle = () => {
        setShowPassword((prev) => !prev);
        setTimeout(() => document.getElementById('password')?.focus(), 0);
    };

    const handleNextStep = async (e) => {
        e.preventDefault();
        const isStepValid = await trigger(['name', 'email']);
        if (isStepValid) {
            setStep(2);
        }
    }

    const handleFinalSubmit = (data) => {
        console.log("✅ Final Validated Form Data:", data);
    }

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <div key={'step1'} className='flex flex-col gap-7 border-slate-300 text-slate-300'>
                        <div className='relative w-full'>
                            <input
                                {...register('name')}
                                type="text"
                                id="name"
                                className="peer w-full border-b bg-transparent py-2 pl-10 placeholder-transparent transition-all duration-300 outline-none focus:pr-10 focus:pl-2 [:not(:placeholder-shown)]:pr-10 [:not(:placeholder-shown)]:pl-2"
                                placeholder=" "
                            />
                            <label
                                htmlFor="name"
                                className="pointer-events-none absolute top-1/2 left-10 -translate-y-1/2 cursor-text text-sm transition-all duration-300 peer-focus:-top-1 peer-focus:left-0 peer-focus:text-xs peer-[:not(:placeholder-shown)]:-top-1 peer-[:not(:placeholder-shown)]:left-0 peer-[:not(:placeholder-shown)]:text-xs sm:text-lg"
                            >
                                Full Name
                            </label>
                            <User className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transition-all duration-500 peer-focus:left-[calc(100%-28px)] peer-[:not(:placeholder-shown)]:left-[calc(100%-28px)]" />

                            {errors.name && (
                                <span className="absolute -bottom-5 right-2 italic text-xs text-red-500">{errors.name.message}</span>
                            )}
                        </div>
                        <div className="relative w-full">
                            <input
                                {...register('email')}
                                type="email"
                                id="email"
                                className="peer w-full border-b bg-transparent py-2 pl-10 placeholder-transparent transition-all duration-300 outline-none focus:pr-10 focus:pl-2 [:not(:placeholder-shown)]:pr-10 [:not(:placeholder-shown)]:pl-2"
                                placeholder=" "
                            />
                            <label
                                htmlFor="email"
                                className="pointer-events-none absolute top-1/2 left-10 -translate-y-1/2 cursor-text text-sm transition-all duration-300 peer-focus:-top-1 peer-focus:left-0 peer-focus:text-xs peer-[:not(:placeholder-shown)]:-top-1 peer-[:not(:placeholder-shown)]:left-0 peer-[:not(:placeholder-shown)]:text-xs sm:text-lg"
                            >
                                Email
                            </label>
                            <Mail className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transition-all duration-500 peer-focus:left-[calc(100%-28px)] peer-[:not(:placeholder-shown)]:left-[calc(100%-28px)]" />
                            {errors.email && (
                                <span className="absolute -bottom-5 right-2 italic text-xs text-red-500">{errors.email.message}</span>
                            )}
                        </div>
                    </div>
                )
            case 2:
                return (
                    <div key={'step2'} className='flex flex-col gap-5 border-slate-300 text-slate-300 sm:gap-7'>
                        <div className="relative w-full">
                            <input
                                {...register('password')}
                                type={
                                    showPassword ? 'text' : 'password'
                                }
                                id="password"
                                placeholder=" "
                                className="peer w-full border-b bg-transparent py-2 pl-10 placeholder-transparent transition-all duration-300 outline-none focus:pr-10 focus:pl-2 [:not(:placeholder-shown)]:pr-10 [:not(:placeholder-shown)]:pl-2"
                            />

                            <label
                                htmlFor="password"
                                className="pointer-events-none absolute top-1/2 left-10 -translate-y-1/2 cursor-text text-sm transition-all duration-300 peer-focus:-top-1 peer-focus:left-0 peer-focus:text-xs peer-[:not(:placeholder-shown)]:-top-1 peer-[:not(:placeholder-shown)]:left-0 peer-[:not(:placeholder-shown)]:text-xs sm:text-lg"
                            >
                                Password
                            </label>

                            <Lock className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 opacity-100 transition-all duration-500 peer-focus:left-[calc(100%-28px)] peer-focus:opacity-0 peer-[:not(:placeholder-shown)]:left-[calc(100%-28px)] peer-[:not(:placeholder-shown)]:opacity-0" />

                            <Button
                                onMouseDown={(e) => e.preventDefault()}
                                type="button"
                                onPress={handleToggle}
                                className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 rounded-full p-0 opacity-0 transition-all duration-500 peer-focus:pointer-events-auto peer-focus:left-[calc(100%-28px)] peer-focus:opacity-100 peer-[:not(:placeholder-shown)]:pointer-events-auto peer-[:not(:placeholder-shown)]:left-[calc(100%-28px)] peer-[:not(:placeholder-shown)]:opacity-100"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </Button>
                            {errors.password && (
                                <span className="absolute -bottom-5 right-2 italic text-xs text-red-500">{errors.password.message}</span>
                            )}
                        </div>

                        <div className="relative w-full">
                            <input
                                {...register('confirmPassword')}
                                type="password"
                                id="confirmPassword"
                                placeholder=" "
                                className="peer w-full border-b bg-transparent py-2 pl-10 placeholder-transparent transition-all duration-300 outline-none focus:pr-10 focus:pl-2 [:not(:placeholder-shown)]:pr-10 [:not(:placeholder-shown)]:pl-2"
                            />

                            <label
                                htmlFor="confirmPassword"
                                className="pointer-events-none absolute top-1/2 left-10 -translate-y-1/2 cursor-text text-sm transition-all duration-300 peer-focus:-top-1 peer-focus:left-0 peer-focus:text-xs peer-[:not(:placeholder-shown)]:-top-1 peer-[:not(:placeholder-shown)]:left-0 peer-[:not(:placeholder-shown)]:text-xs sm:text-lg"
                            >
                                Confirm Password
                            </label>

                            <Lock className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transition-all duration-500 peer-focus:left-[calc(100%-28px)] peer-[:not(:placeholder-shown)]:left-[calc(100%-28px)]" />
                            {errors.confirmPassword && (
                                <span className="absolute -bottom-5 right-2 italic text-xs text-red-500">{errors.confirmPassword.message}</span>
                            )}
                        </div>
                    </div>
                )
            default:
                return null;
        }
    }

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
                    className='space-y-4'
                >
                    <div className="flex flex-col items-center">
                        <div className="mb-2 h-24 w-24">
                            <Logo className="logo-box-shadow h-full w-full" />
                        </div>
                        <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
                            Convia
                        </h1>
                        <p className="text-center text-xl font-bold tracking-tight sm:text-2xl">
                            Connect beyond{' '}
                            <span className="gradient-text">boundaries.</span>
                        </p>
                    </div>

                    <div className="flex justify-center gap-2 mt-4 mb-2">
                        {[1, 2].map((i) => (
                            <div key={i} className={`h-2 rounded-full transition-all duration-500 ${step === i ? 'w-8 bg-indigo-500' : 'w-2 bg-slate-600'}`} />
                        ))}
                    </div>

                    <div className="w-full max-w-md px-5 sm:px-10">

                        <form onSubmit={step === 2 ? handleSubmit(handleFinalSubmit) : handleNextStep} className='space-y-5'>
                            {renderStepContent()}
                            <Button
                                type="submit"
                                className="from-indigo via-pink to-purple mt-7 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r text-lg font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-indigo-500/50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 sm:my-7"
                            >
                                {false ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    <>
                                        {step === 2 ? 'Join Now' : 'Next'}
                                        <ArrowRight className="h-5 w-5" />
                                    </>
                                )}
                            </Button>

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
                                <MotionDiv
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: {
                                            opacity: 1,
                                            y: 0,
                                            transition: {
                                                type: 'spring',
                                                stiffness: 200,
                                            },
                                        },
                                    }}
                                >
                                    <Link to={'#'}>
                                        <Button className="h-10 w-10 rounded-full p-0 duration-300 hover:scale-110">
                                            <FcGoogle className="text-2xl" />
                                        </Button>
                                    </Link>
                                </MotionDiv>

                                <MotionDiv
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: {
                                            opacity: 1,
                                            y: 0,
                                            transition: {
                                                type: 'spring',
                                                stiffness: 200,
                                            },
                                        },
                                    }}
                                >
                                    <Link to={''} target="_blank">
                                        <Button className="h-10 w-10 rounded-full p-0 duration-300 hover:scale-110">
                                            <RiGithubLine className="text-2xl" />
                                        </Button>
                                    </Link>
                                </MotionDiv>

                                <MotionDiv
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: {
                                            opacity: 1,
                                            y: 0,
                                            transition: {
                                                type: 'spring',
                                                stiffness: 200,
                                            },
                                        },
                                    }}
                                >
                                    <Link to={''} target="_blank">
                                        <Button className="h-10 w-10 rounded-full p-0 duration-300 hover:scale-110">
                                            <FaLinkedinIn className="text-2xl text-blue-500" />
                                        </Button>
                                    </Link>
                                </MotionDiv>
                            </MotionDiv>
                        </form>

                        <div className="mt-5 text-center">
                            <p className="text-sm text-slate-400">
                                By creating an account
                                You agree to the {' '}
                                <Link
                                    to={'/auth/login'}
                                    className="text-indigo font-bold hover:underline"
                                >
                                    Terms and Conditions
                                </Link>
                            </p>
                        </div>

                        <div className="mt-5 text-center">
                            <p className="text-sm text-slate-400">
                                Already have an account?{' '}
                                <Link
                                    to={'/auth/login'}
                                    className="text-indigo font-bold hover:underline"
                                >
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