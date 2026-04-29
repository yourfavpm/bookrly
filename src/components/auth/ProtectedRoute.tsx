import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useAppStore((state) => state.user);
  const loading = useAppStore((state) => state.loading);
  const location = useLocation();

  // Only show full-screen loader on initial mount when we don't know if the user is logged in
  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-header">
        <div className="w-1.5 h-1.5 rounded-full bg-brand animate-ping" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
