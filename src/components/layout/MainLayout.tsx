
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/common/navbar/Navbar';

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
