
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/common/navbar';
import { Toaster } from '@/components/ui/toaster';
import { UserPreferencesProvider } from '@/contexts/UserPreferencesContext';

interface MainLayoutProps {
  children?: React.ReactNode;
  hideNavbar?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, hideNavbar = false }) => {
  return (
    <UserPreferencesProvider>
      <div className="flex flex-col h-screen overflow-hidden bg-background">
        {!hideNavbar && <Navbar />}
        <div className="flex-1 flex overflow-auto">
          <main className="flex-1 overflow-auto">
            {children || <Outlet />}
            <Toaster />
          </main>
        </div>
      </div>
    </UserPreferencesProvider>
  );
};

export default MainLayout;
