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

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const inputRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted');
    };

    const handleToggle = () => {
        setShowPassword((prev) => !prev);
        inputRef.current.focus();
    };
    return (
        <MotionDiv className="flex h-full w-full flex-col items-center justify-center p-5">
            <GlassCard
                color={'#6366f1'}
                className="w-full max-w-md space-y-5 rounded-xl border border-white/10 py-6 hover:backdrop-blur-xs"
            >
                <MotionDiv
                    initial={{ opacity: 0, y: 30 }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        transition: { type: 'spring', duration: 1 },
                    }}
                >
                    <div className="flex flex-col items-center">
                        <div className="mb-2 h-24 w-24">
                            <Logo className="logo-shadow h-full w-full" />
                        </div>
                        <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
                            Convia
                        </h1>
                        <p className="text-center text-xl font-bold tracking-tight sm:text-2xl">
                            Connect beyond{' '}
                            <span className="bg-linear-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                                boundaries.
                            </span>
                        </p>
                    </div>

                    <div className="my-4">
                        <h2 className="text-center text-xl font-bold text-white">
                            Welcome Back{' '}
                            <span className="bg-linear-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                                Cheif!
                            </span>
                        </h2>
                    </div>

                    <div className="w-full max-w-md px-5 sm:px-10">
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-5 sm:gap-7">
                                <div className="relative w-full">
                                    <input
                                        type="email"
                                        id="email"
                                        className="peer w-full border-b border-slate-300 bg-transparent py-2 pl-10 placeholder-transparent transition-all duration-300 outline-none focus:pr-10 focus:pl-2 [:not(:placeholder-shown)]:pr-10 [:not(:placeholder-shown)]:pl-2"
                                        placeholder=" "
                                    />
                                    <label
                                        htmlFor="email"
                                        className="pointer-events-none absolute top-1/2 left-10 -translate-y-1/2 cursor-text text-sm text-slate-400 transition-all duration-300 peer-focus:-top-1 peer-focus:left-0 peer-focus:text-xs peer-[:not(:placeholder-shown)]:-top-1 peer-[:not(:placeholder-shown)]:left-0 peer-[:not(:placeholder-shown)]:text-xs sm:text-lg"
                                    >
                                        Email
                                    </label>
                                    <Mail className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-400 transition-all duration-500 peer-focus:left-[calc(100%-28px)] peer-[:not(:placeholder-shown)]:left-[calc(100%-28px)]" />
                                </div>

                                <div className="relative w-full">
                                    <input
                                        ref={inputRef}
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        id="password"
                                        placeholder=" "
                                        className="peer w-full border-b border-slate-300 bg-transparent py-2 pl-10 placeholder-transparent transition-all duration-300 outline-none focus:pr-10 focus:pl-2 [:not(:placeholder-shown)]:pr-10 [:not(:placeholder-shown)]:pl-2"
                                    />

                                    <label
                                        htmlFor="password"
                                        className="pointer-events-none absolute top-1/2 left-10 -translate-y-1/2 cursor-text text-sm text-slate-400 transition-all duration-300 peer-focus:-top-1 peer-focus:left-0 peer-focus:text-xs peer-[:not(:placeholder-shown)]:-top-1 peer-[:not(:placeholder-shown)]:left-0 peer-[:not(:placeholder-shown)]:text-xs sm:text-lg"
                                    >
                                        Password
                                    </label>

                                    <Lock className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-400 opacity-100 transition-all duration-500 peer-focus:left-[calc(100%-28px)] peer-focus:opacity-0 peer-[:not(:placeholder-shown)]:left-[calc(100%-28px)] peer-[:not(:placeholder-shown)]:opacity-0" />

                                    <Button
                                        onMouseDown={(e) => e.preventDefault()}
                                        type="button"
                                        onPress={handleToggle}
                                        className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 rounded-full p-0 text-slate-400 opacity-0 transition-all duration-500 peer-focus:pointer-events-auto peer-focus:left-[calc(100%-28px)] peer-focus:opacity-100 peer-[:not(:placeholder-shown)]:pointer-events-auto peer-[:not(:placeholder-shown)]:left-[calc(100%-28px)] peer-[:not(:placeholder-shown)]:opacity-100"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="my-5 flex h-14 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-linear-to-r from-indigo-600 via-purple-600 to-purple-700 text-lg font-bold text-white shadow-lg shadow-indigo-500/30 transition-all hover:scale-[1.02] hover:shadow-indigo-500/50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 sm:my-7"
                            >
                                {false ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight className="h-5 w-5" />
                                    </>
                                )}
                            </Button>

                            <div className="mb-3 flex w-full items-center justify-between gap-3 text-sm text-slate-300">
                                <span className="w-full border border-slate-700"></span>
                                <span>OR</span>
                                <span className="w-full border border-slate-700"></span>
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
                                        <Button className="h-10 w-10 rounded-full p-0 hover:scale-110">
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
                                        <Button className="h-10 w-10 rounded-full p-0 hover:scale-110">
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
                                        <Button className="h-10 w-10 rounded-full p-0 hover:scale-110">
                                            <FaLinkedinIn className="text-2xl text-blue-500" />
                                        </Button>
                                    </Link>
                                </MotionDiv>
                            </MotionDiv>
                        </form>

                        <div className="mt-5 text-center">
                            <p className="text-sm text-slate-400">
                                New to Convia?{' '}
                                <Link
                                    to={'/auth/register'}
                                    className="font-bold text-indigo-400 transition-colors hover:text-indigo-300 hover:underline"
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
