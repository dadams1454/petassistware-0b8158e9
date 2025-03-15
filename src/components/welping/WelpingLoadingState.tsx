
import React from 'react';
import MainLayout from '@/layouts/MainLayout';

interface WelpingLoadingStateProps {
  isLoading: boolean;
  error: Error | null;
}

const WelpingLoadingState: React.FC<WelpingLoadingStateProps> = ({ isLoading, error }) => {
  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-6">
          <p>Loading litter details...</p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto py-6">
          <div className="mt-6 text-center text-red-500">
            <p>Error loading litter details. The litter may not exist.</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return null;
};

export default WelpingLoadingState;
