import React from 'react';
import { Logo } from '../common/Logo';

export default function AuthHeader() {
    return (
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
    );
}
