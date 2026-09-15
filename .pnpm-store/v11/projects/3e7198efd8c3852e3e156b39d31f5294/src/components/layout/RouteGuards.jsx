import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/auth';
import { Loader2 } from 'lucide-react';

// ProtectedRoute: redirects to /login if not authenticated
export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-main)' }}>
        <Loader2 className="pulse-anim" size={48} color="var(--primary)" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// AdminRoute: redirects to / if user is not admin
export const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-main)' }}>
        <Loader2 className="pulse-anim" size={48} color="var(--primary)" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};
