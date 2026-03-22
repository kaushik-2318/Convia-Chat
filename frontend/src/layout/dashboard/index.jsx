import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function DashboardLayout() {
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  if (!isLoggedIn || !user) {
    return <Navigate to="/auth/welcome" replace />;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
