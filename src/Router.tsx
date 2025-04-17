
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './AppRoutes';
import ErrorBoundary from './components/ErrorBoundary';

/**
 * Main router component that provides the BrowserRouter context
 * and error boundary for the entire application.
 */
const Router = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AppRoutes />
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Router;
