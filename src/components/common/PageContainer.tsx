
import React from 'react';
import MainLayout from '@/layouts/MainLayout';

interface PageContainerProps {
  children: React.ReactNode;
}

/**
 * Standard wrapper for page content.
 * Ensures consistent usage of MainLayout across all pages.
 */
const PageContainer: React.FC<PageContainerProps> = ({ children }) => {
  return <MainLayout>{children}</MainLayout>;
};

export default PageContainer;
