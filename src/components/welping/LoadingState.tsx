
import React from 'react';
import MainLayout from '@/layouts/MainLayout';

interface LoadingStateProps {
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ message = "Loading..." }) => {
  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <p>{message}</p>
      </div>
    </MainLayout>
  );
};

export default LoadingState;
