
import React from 'react';
import { Routes } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import { appRoutes } from './routes';

const Router = () => {
  return (
    <ErrorBoundary>
      <Routes>
        {appRoutes}
      </Routes>
    </ErrorBoundary>
  );
};

export default Router;
