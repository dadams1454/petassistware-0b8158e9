
import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ children, className = '' }) => {
  return (
    <div className={`container max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 ${className}`}>
      {children}
    </div>
  );
};

export default PageContainer;
