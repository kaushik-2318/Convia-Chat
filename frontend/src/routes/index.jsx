import React, { lazy } from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
import AuthLayout from '@/layout/auth';
import { SidebarProvider } from '@/components/ui/sidebar';
import DashboardLayout from '@/layout/dashboard';
import Loadable from '@/components/Loadable';
import { DEFAULT_AUTH, DEFAULT_PATH } from '@/config';
import GuestGuard from '@/guards/GuestGuard';
import AuthGuard from '@/guards/AuthGuard';
import VerifyGuard from '@/guards/VerifyGuard';

export default function Router() {
  return useRoutes([
    {
      path: '/auth',
      element: <AuthLayout />,
      children: [
        {
          element: <Navigate to={DEFAULT_AUTH} replace />,
          index: true,
        },
        {
          path: 'welcome',
          element: (
            <GuestGuard>
              <WelcomePage />
            </GuestGuard>
          ),
        },
        {
          path: 'login',
          element: (
            <GuestGuard>
              <LoginPage />
            </GuestGuard>
          ),
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <RegisterPage />
            </GuestGuard>
          ),
        },
        {
          path: 'verify-otp',
          element: (
            <VerifyGuard>
              <VerifyPage />
            </VerifyGuard>
          ),
        },
        {
          path: 'forgot-password',
          element: (
            <GuestGuard>
              <ForgotPasswordPage />
            </GuestGuard>
          ),
        },
        {
          path: 'reset-password/:token',
          element: (
            <GuestGuard>
              <ResetPasswordPage />
            </GuestGuard>
          ),
        },
      ],
    },
    {
      path: '/',
      element: (
        <AuthGuard>
          <SidebarProvider>
            <DashboardLayout />
          </SidebarProvider>
        </AuthGuard>
      ),
      children: [
        {
          element: <Navigate to={DEFAULT_PATH} replace />,
          index: true,
        },
        { path: 'app', element: <GeneralApp /> },
        { path: 'group', element: <GroupChat /> },
        { path: 'profile', element: <ProfilePage /> },
        { path: 'contact', element: <ContactPage /> },
        { path: 'settings', element: <Settings /> },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" replace /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

const WelcomePage = Loadable(lazy(() => import('../pages/auth/WelcomePage')));
const LoginPage = Loadable(lazy(() => import('../pages/auth/LoginPage')));
const RegisterPage = Loadable(lazy(() => import('../pages/auth/RegisterPage')));
const VerifyPage = Loadable(lazy(() => import('../pages/auth/OtpVerifyPage')));
const ForgotPasswordPage = Loadable(lazy(() => import('../pages/auth/ForgotPasswordPage')));
const ResetPasswordPage = Loadable(lazy(() => import('../pages/auth/ResetPasswordPage')));

const GeneralApp = Loadable(lazy(() => import('../pages/dashboard/GeneralApp')));
const GroupChat = Loadable(lazy(() => import('../pages/dashboard/GroupChat')));
const ProfilePage = Loadable(lazy(() => import('../pages/dashboard/ProfilePage')));
const ContactPage = Loadable(lazy(() => import('../pages/dashboard/ContactPage')));
const Settings = Loadable(lazy(() => import('../pages/dashboard/Settings')));

// const TnCPage = Loadable(lazy(() => import("../pages/docs/TnC")));
const Page404 = Loadable(lazy(() => import('../pages/Page404')));
