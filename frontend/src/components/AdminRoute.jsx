// client/src/components/AdminRoute.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  
  // Check if user is authenticated
  if (!isAuthenticated) {
    // If not authenticated, redirect to login page
    return <Navigate to="/login" replace />;
  }
  
  // Check if authenticated user has admin role
  if (user?.role !== 'admin') {
    // If not an admin, redirect to home page (or perhaps a 403 Forbidden page)
    return <Navigate to="/" replace />;
  }
  
  // If authenticated and is an admin, render the children components
  return children;
};

export default AdminRoute;