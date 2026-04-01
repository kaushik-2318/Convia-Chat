import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/redux/hooks';
import { DEFAULT_PATH } from '@/config';

/**
 * GuestGuard — Only unauthenticated users can pass through.
 * Logged-in users are redirected to the dashboard.
 */
export default function GuestGuard({ children }) {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);

  if (isLoggedIn) {
    return <Navigate to={DEFAULT_PATH} replace />;
  }

  return children;
}
