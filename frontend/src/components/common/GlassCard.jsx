import React from 'react';
import { cn } from '@/lib/utils';

export const GlassCard = ({
    children,
    className,
    variant = 'neo',
    ...props
}) => {

    const variants = {
        light: 'bg-white/10 border-white/20 text-slate-800 shadow-xl shadow-white/5',
        dark: 'bg-slate-900/60 border-white/10 text-slate-100 shadow-2xl shadow-black/40',
        solid: 'bg-slate-950 border-slate-800 text-slate-100',
        neo: 'bg-gradient-to-br from-slate-900/80 to-slate-900/40 border-t-white/10 border-l-white/10 border-b-black/30 border-r-black/30 shadow-2xl',
    };

    return (
        <div
            className={cn(
                'rounded-3xl transition-all duration-300 backdrop-blur-2xl relative overflow-hidden border',
                variants[variant],
                className
            )}
            {...props}
        >
            <div className="relative z-10 h-full w-full">{children}</div>
        </div>
    );
};
