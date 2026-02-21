import React from 'react';

export const Logo = ({ className = '' }) => {
    return (
        <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                <linearGradient
                    id="convia-gradient"
                    x1="0"
                    y1="0"
                    x2="100"
                    y2="100"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#6366f1" /> {/* Indigo 500 */}
                    <stop offset="0.5" stopColor="#a855f7" /> {/* Purple 500 */}
                    <stop offset="1" stopColor="#ec4899" /> {/* Pink 500 */}
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            {/* Outer C shape - Stylized conversation bubble/arc */}
            <path
                d="M70 30C60 20 40 20 30 30C15 45 15 70 30 80C45 90 65 85 75 70"
                stroke="url(#convia-gradient)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow)"
            />

            {/* Accent dot representing connection/active status */}
            <circle cx="72" cy="40" r="9" fill="url(#convia-gradient)" filter="url(#glow)" />
        </svg>
    );
};
