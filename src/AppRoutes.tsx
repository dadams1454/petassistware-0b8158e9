
import React from 'react';
import { Routes } from 'react-router-dom';
import appRoutes from './routes';
import { useAuth } from './contexts/AuthProvider';
import { AuthLoadingState } from './components/ui/standardized';

export const AppRoutes: React.FC = () => {
  const { loading } = useAuth();

  if (loading) {
    return <AuthLoadingState message="Loading application..." fullPage />;
  }

  return <Routes>{appRoutes}</Routes>;
};
