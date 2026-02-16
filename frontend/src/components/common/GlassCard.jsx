import React from 'react';
import { cn } from '@/lib/utils';

// interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
//   variant?: 'light' | 'dark' | 'solid' | 'neo';
//   interactive?: boolean;
// }

export const GlassCard = ({
    children,
    className,
    variant = 'light',
    interactive = false,
    ...props
}) => {
    const baseStyles =
        'rounded-3xl transition-all duration-300 backdrop-blur-2xl relative overflow-hidden border';

    const variants = {
        light: 'bg-white/10 border-white/20 text-slate-800 shadow-xl shadow-white/5',
        dark: 'bg-slate-900/60 border-white/10 text-slate-100 shadow-2xl shadow-black/40',
        solid: 'bg-slate-950 border-slate-800 text-slate-100',
        neo: 'bg-gradient-to-br from-slate-900/80 to-slate-900/40 border-t-white/10 border-l-white/10 border-b-black/30 border-r-black/30 shadow-2xl',
    };

    const interactiveStyles = interactive
        ? 'hover:bg-slate-800/40 hover:border-indigo-500/30 hover:shadow-indigo-500/10 hover:-translate-y-0.5 cursor-pointer'
        : '';

    return (
        <div
            className={cn(
                baseStyles,
                variants[variant],
                interactiveStyles,
                className
            )}
            {...props}
        >
            {/* Shine effect */}
            <div className="absolute top-0 left-0 h-px w-full bg-linear-to-r from-transparent via-white/20 to-transparent opacity-50"></div>

            {/* Content */}
            <div className="relative z-10 h-full w-full">{children}</div>
        </div>
    );
};
