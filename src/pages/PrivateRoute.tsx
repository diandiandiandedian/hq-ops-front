import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  if (!isAuthenticated) {
    // 如果未登录，重定向到登录页面
    return <Navigate to="/login" replace />;
  }

  // 如果已登录，渲染子组件
  return <>{children}</>;
};

export default PrivateRoute;
