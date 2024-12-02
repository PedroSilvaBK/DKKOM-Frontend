// PrivateRoute.tsx
import React from 'react';
import { Navigate, PathRouteProps } from 'react-router-dom';
import { useAuth } from './AuthProvider';

interface PrivateRouteProps extends PathRouteProps {
  children?: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn() ? (
    children
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;
