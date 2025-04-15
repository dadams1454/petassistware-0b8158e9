
import React from 'react';
import { Routes } from 'react-router-dom';
import appRoutes from './routes';
import useAuth from './hooks/useAuth';
import { LoadingState } from './components/ui/standardized';

export const AppRoutes: React.FC = () => {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingState message="Loading application..." size="large" />;
  }

  return <Routes>{appRoutes}</Routes>;
};
