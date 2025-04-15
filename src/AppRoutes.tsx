
import React from 'react';
import { Routes } from 'react-router-dom';
import appRoutes from './routes';
import { useAuth } from '@/contexts/AuthProvider';
import { LoadingState } from './components/ui/standardized';

export const AppRoutes: React.FC = () => {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingState message="Loading application..." size="large" fullPage />;
  }

  return <Routes>{appRoutes}</Routes>;
};
