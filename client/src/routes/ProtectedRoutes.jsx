import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show a loading state if the authentication status is still being determined
  if (loading) {
    return <div>Loading...</div>;
  }

  // If the user is not authenticated and not on the registration page, redirect to login
  if (!user?.token && !location.pathname.includes('register')) {
    return <Navigate to="/login" replace />;
  }

  // If the user is authenticated and trying to access login or register page, redirect to dashboard
  if (user?.token && (location.pathname === '/login' || location.pathname === '/register')) {
    return <Navigate to="/dashboard" replace />;
  }

  // If the user is authenticated and the route is protected, render the children components
  return children;
};

export default ProtectedRoute;
