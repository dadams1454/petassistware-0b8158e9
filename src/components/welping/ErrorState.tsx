
import React from 'react';
import MainLayout from '@/layouts/MainLayout';

interface ErrorStateProps {
  message?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message = "An error occurred." }) => {
  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="mt-6 text-center text-red-500">
          <p>{message}</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default ErrorState;
