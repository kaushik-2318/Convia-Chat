import React, { useEffect, useState } from 'react';
import { ArrowRight, Linkedin } from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { GlassCard } from '@/components/common/GlassCard';
import { MotionDiv } from '@/components/common/MotionWrapper';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@heroui/button';
import { Separator } from '@/components/ui/separator';
import { GithubLogoIcon, InstagramLogoIcon } from '@phosphor-icons/react';

export default function WelcomePage() {
    const [url, setUrl] = useState('');
    const [clickCoords, setClickCoords] = useState({
        x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
        y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
    });

    useEffect(() => {
        const handleFetch = async () => {
            const resp = await axios.get('https://pget.vercel.app/');
            setUrl(resp.data);
        };
        handleFetch();
    }, []);

    const SocialArray = [
        {
            bg: '#2b3137',
            link: 'https://github.com/kaushik-2318',
            icon: <GithubLogoIcon color="#fafbfc" size={25} alt="github" />,
        },
        {
            bg: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%,#d6249f 60%,#285AEB 90%)',
            link: 'https://instagram.com/kaushikverma.me',
            icon: <InstagramLogoIcon color="#fff" size={25} alt="instagram" />,
        },
        {
            bg: '#0A66C2',
            link: 'https://www.linkedin.com/in/kaushikverma',
            icon: <Linkedin color="#fff" alt="linkedin" />,
        },
    ];

    return (
        <div className="flex h-full w-full flex-col items-center justify-center px-5">
            <MotionDiv
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.1,
                            delayChildren: 0.1,
                        },
                    },
                }}
                className="z-2 grid max-w-lg grid-cols-1 gap-10 rounded-2xl border border-slate-800 bg-slate-950 p-5 md:max-w-2xl md:grid-cols-2 md:gap-0 lg:max-w-5xl lg:p-15 lg:py-14"
            >
                <div className="order-2 w-full space-y-4 text-center">
                    <MotionDiv
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: {
                                opacity: 1,
                                y: 0,
                                transition: { type: 'spring', stiffness: 100 },
                            },
                        }}
                    >
                        <div className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
                            Welcome to <br />
                            <span className="bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent md:text-6xl">
                                Convia Chat
                            </span>
                        </div>
                        <p className="mb-4 text-xl font-bold tracking-tight">
                            Connect beyond{' '}
                            <span className="bg-linear-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                                boundaries.
                            </span>
                        </p>

                        <p className="text-gray-400">
                            A robust web-based Real-Time Chat App developed by{' '}
                            <Link
                                to={url}
                                target="_blank"
                                className="text-indigo-500"
                            >
                                Kaushik Verma
                            </Link>
                            .
                        </p>

                        <Separator className="my-5 hidden bg-slate-700 lg:block" />
                        <MotionDiv
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: { opacity: 0 },
                                visible: {
                                    opacity: 1,
                                    transition: { staggerChildren: 0.2 },
                                },
                            }}
                            className="hidden items-center justify-center gap-10 lg:flex"
                        >
                            {SocialArray.map((social, index) => (
                                <MotionDiv
                                    key={index}
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
                                    <Link to={social.link} target="_blank">
                                        <Button
                                            className="h-10 w-10 rounded-full p-0 hover:scale-110 duration-200"
                                            style={{ background: social.bg }}
                                        >
                                            {social.icon}
                                        </Button>
                                    </Link>
                                </MotionDiv>
                            ))}
                        </MotionDiv>
                    </MotionDiv>
                </div>

                <MotionDiv
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: {
                            opacity: 1,
                            y: 0,
                            transition: { type: 'spring', stiffness: 100 },
                        },
                    }}
                    className="order-1 flex items-center justify-center md:order-2"
                >
                    <div className="relative flex h-40 w-40 items-center justify-center md:h-60 md:w-60">
                        <div className="absolute inset-0 animate-pulse rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 opacity-10 blur-3xl"></div>

                        <GlassCard
                            variant="neo"
                            className="h-full w-full border-white/20"
                        >
                            <div className="absolute top-1/2 left-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
                            <div className="absolute top-1/2 left-1/2 h-[85%] w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />

                            <div className="flex h-full w-full items-center justify-center">
                                <Logo className="h-20 w-20 md:h-40 md:w-40" />
                            </div>
                        </GlassCard>
                    </div>
                </MotionDiv>
            </MotionDiv>

            <MotionDiv
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0, y: -20 },
                    visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                            type: 'spring',
                            stiffness: 100,
                            delay: 0.2,
                            staggerChildren: 0.5,
                        },
                    },
                }}
                className="flex w-full flex-col items-center justify-center md:w-2xl md:flex-row"
            >
                <div className="relative z-1 h-9 w-full max-w-100 md:w-1/2">
                    <MotionDiv
                        variants={{
                            hidden: { opacity: 0, y: -20 },
                            visible: {
                                opacity: 1,
                                y: 0,
                                transition: { duration: 0.2 },
                            },
                        }}
                        className="absolute -top-2 flex h-full w-full flex-col justify-center gap-4 md:w-full"
                    >
                        <Button className="flex transform items-center justify-center gap-2 rounded-b-xl bg-white px-4 py-5 pt-7.5 font-bold text-slate-950 shadow-xl shadow-white/10 transition-all hover:scale-105 active:scale-95">
                            Sign Up Now
                            <ArrowRight className="h-5 w-5" />
                        </Button>
                    </MotionDiv>
                </div>

                <div className="relative z-0 md:z-1 h-9 w-full max-w-100 md:w-1/2">
                    <MotionDiv
                        variants={{
                            hidden: { opacity: 0, y: -20 },
                            visible: {
                                opacity: 1,
                                y: 0,
                                transition: { duration: 0.2 },
                            },
                        }}
                        className="absolute -top-2 flex h-full w-full flex-col justify-center gap-4 md:w-full"
                    >
                        <Button className="flex transform items-center justify-center rounded-b-xl border border-white/10 bg-slate-800/50 px-4 py-5 pt-7.5 font-semibold text-white transition-all hover:scale-105 hover:bg-slate-800 active:scale-95">
                            Login
                        </Button>
                    </MotionDiv>
                </div>
            </MotionDiv>

            <Dialog>
                <DialogTrigger
                    onClick={(e) => {
                        e.stopPropagation();
                        setClickCoords({ x: e.clientX, y: e.clientY });
                    }}
                    className="absolute bottom-4 w-[90%] max-w-lg cursor-pointer"
                >
                    <MotionDiv
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0, y: 100 },
                            visible: {
                                opacity: 1,
                                y: 0,
                                transition: {
                                    duration: 0.5,
                                    type: 'spring',
                                    stiffness: 100,
                                },
                            },
                        }}
                    >
                        <GlassCard
                            variant="dark"
                            className="w-full border-white/20 p-5 text-white"
                        >
                            <div className="flex items-center gap-3 text-center">
                                <span className="h-px flex-1 bg-gray-400"></span>
                                What is Convia Chat?
                                <span className="h-px flex-1 bg-gray-400"></span>
                            </div>
                        </GlassCard>
                    </MotionDiv>
                </DialogTrigger>
                <DialogContent
                    className={'text-white backdrop-blur-2xl'}
                    variant="neo"
                    clickCoords={clickCoords}
                >
                    <DialogHeader className={'space-y-2.5'}>
                        <DialogTitle className={'text-xl'}>
                            What is Convia Chat?
                        </DialogTitle>
                        <DialogDescription className={'text-justify'}>
                            Convia Chat is a real-time web-based chat
                            application developed by{' '}
                            <Link
                                to={url}
                                target="_blank"
                                className="text-indigo-500"
                            >
                                Kaushik Verma
                            </Link>
                            . Boasting not only a visually appealing UI but also
                            packed with an array of enticing features, Convia
                            Chat is designed to provide with the best user
                            experience. Powered by the dynamic MERN stack and
                            enriched with the sleek design elements of Tailwind
                            CSS, this application delivers a seamless chatting
                            experience. From connecting with friends to instant
                            messaging system, Convia Chat ensures not just
                            connectivity but a symphony of interactivity and
                            speed for its users.
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}
