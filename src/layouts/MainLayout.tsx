
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/common/navbar';
import { Sidebar, SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { UserPreferencesProvider } from '@/contexts/UserPreferencesContext';

interface MainLayoutProps {
  children?: React.ReactNode;
  hideNavbar?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, hideNavbar = false }) => {
  return (
    <UserPreferencesProvider>
      <SidebarProvider defaultOpen={true}>
        <div className="flex h-screen overflow-hidden bg-background">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            {!hideNavbar && <Navbar />}
            <main className="flex-1 overflow-auto">
              {children || <Outlet />}
              <Toaster />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </UserPreferencesProvider>
  );
};

export default MainLayout;
