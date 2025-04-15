
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/common/Navbar';

const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="flex-grow p-4 md:p-6 container mx-auto max-w-7xl">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
