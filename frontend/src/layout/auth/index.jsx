import React from 'react';
import { Navigate, Outlet, Link } from 'react-router-dom';

export default function AuthLayout() {
    return (
        <div className="h-full">
            <Outlet />
        </div>
    );
}
