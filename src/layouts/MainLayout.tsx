
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/common/Navbar';
import Sidebar from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { UserPreferencesProvider } from '@/contexts/UserPreferencesContext';

const MainLayout: React.FC = () => {
  return (
    <UserPreferencesProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        <div className="flex flex-col flex-1 w-0 overflow-auto">
          <Navbar />
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <Outlet />
            <Toaster />
          </main>
        </div>
      </div>
    </UserPreferencesProvider>
  );
};

export default MainLayout;
