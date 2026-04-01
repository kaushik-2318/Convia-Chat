import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/redux/hooks';
import { DEFAULT_PATH } from '@/config';

/**
 * AuthGuard — Only authenticated users can pass through.
 * Unauthenticated users are redirected to login.
 */
export default function AuthGuard({ children }) {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);

  if (!isLoggedIn) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
}
