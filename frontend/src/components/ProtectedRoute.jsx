import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../config/routes.config';
import { Loader } from './Loader';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader message="Verifying session..." />;
  }

  if (!isAuthenticated) {
    // If specific employer role is requested, send to employer login
    const isEmployerRoute = allowedRoles.includes('Employer') && !allowedRoles.includes('JobSeeker');
    const redirectPath = isEmployerRoute ? ROUTES.EMPLOYER_LOGIN : ROUTES.USER_LOGIN;
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // Role mismatch -> redirect to appropriate home or profile
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return children;
};
