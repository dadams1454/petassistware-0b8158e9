
import React from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';

interface PageContainerProps {
  children: React.ReactNode;
}

/**
 * Standard wrapper for page content.
 * Ensures consistent usage of MainLayout across all pages.
 */
const PageContainer: React.FC<PageContainerProps> = ({ children }) => {
  return (
    <ErrorBoundary name="PageContainer">
      <div className="container mx-auto">
        {children}
      </div>
    </ErrorBoundary>
  );
};

export default PageContainer;
