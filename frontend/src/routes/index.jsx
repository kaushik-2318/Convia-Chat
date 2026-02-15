import React, { lazy } from 'react'
import { useRoutes, Navigate } from "react-router-dom";
import AuthLayout from '@/layout/auth';
import { SidebarProvider } from '@/components/ui/sidebar';
import Loadable from '@/components/Loadable';
import DashboardLayout from '@/layout/dashboard';

export default function Router() {
    return useRoutes([
        {
            path: "/auth",
            element: <AuthLayout />,
            children: [
                { element: <Navigate to={'/auth/welcome'} replace />, index: true },
                { path: "welcome", element: <WelcomePage /> },
                { path: "login", element: <LoginPage /> },
                { path: "register", element: <RegisterPage /> },
                { path: "verify", element: <VerifyPage /> },
                { path: "forgot-password", element: <ForgotPasswordPage /> },
                { path: "reset-password", element: <ResetPasswordPage /> },
            ],
        },
        {
            path: "/",
            element: (
                <SidebarProvider>
                    <DashboardLayout />
                </SidebarProvider>
            ),
            children: [
                { element: <Navigate to={'/app'} replace />, index: true },
                { path: "app", element: <GeneralApp /> },
                { path: "group", element: <GroupChat /> },
                { path: "profile", element: <ProfilePage /> },
                { path: "contact", element: <ContactPage /> },
                { path: "settings", element: <Settings /> },
                { path: "404", element: <Page404 /> },
                { path: "*", element: <Navigate to="/404" replace /> },
            ],
        },
        { path: "*", element: <Navigate to="/404" replace /> },
    ])
}


const WelcomePage = Loadable(lazy(() => import("../pages/auth/WelcomePage")));
const LoginPage = Loadable(lazy(() => import("../pages/auth/LoginPage")));
const RegisterPage = Loadable(lazy(() => import("../pages/auth/RegisterPage")));
const VerifyPage = Loadable(lazy(() => import("../pages/auth/VerifyPage")));
const ForgotPasswordPage = Loadable(lazy(() => import("../pages/auth/ForgotPasswordPage")));
const ResetPasswordPage = Loadable(lazy(() => import("../pages/auth/ResetPasswordPage")));

const GeneralApp = Loadable(lazy(() => import("../pages/dashboard/GeneralApp")));
const GroupChat = Loadable(lazy(() => import("../pages/dashboard/GroupChat")));
const ProfilePage = Loadable(lazy(() => import("../pages/dashboard/ProfilePage")));
const ContactPage = Loadable(lazy(() => import("../pages/dashboard/ContactPage")));
const Settings = Loadable(lazy(() => import("../pages/dashboard/Settings")));

// const TnCPage = Loadable(lazy(() => import("../pages/docs/TnC")));
const Page404 = Loadable(lazy(() => import("../pages/Page404")));

