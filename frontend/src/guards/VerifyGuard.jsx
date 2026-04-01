import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/redux/hooks';
import { DEFAULT_PATH } from '@/config';

/**
 * VerifyGuard — Only authenticated but UNVERIFIED users can pass through.
 * - Not logged in → redirect to /auth/login
 * - Logged in and already verified → redirect to dashboard
 * - Logged in and unverified → allow through
 */
export default function VerifyGuard({ children }) {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const user = useAppSelector((state) => state.auth.user);

  if (!isLoggedIn) {
    return <Navigate to="/auth/login" replace />;
  }

  if (user?.verified) {
    return <Navigate to={DEFAULT_PATH} replace />;
  }

  return children;
}
