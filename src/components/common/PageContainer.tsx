
import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
}

/**
 * Standard wrapper for page content.
 * Ensures consistent layout across all pages without nesting MainLayout.
 */
const PageContainer: React.FC<PageContainerProps> = ({ children }) => {
  return <div className="w-full">{children}</div>;
};

export default PageContainer;
