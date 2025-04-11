
import React from 'react';
import { AppRoutes } from './AppRoutes';
import ErrorBoundary from './components/ErrorBoundary';

const Router = () => {
  return (
    <ErrorBoundary>
      <AppRoutes />
    </ErrorBoundary>
  );
};

export default Router;
