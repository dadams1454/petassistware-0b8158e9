
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
        <div className="flex h-screen w-full overflow-hidden bg-background">
          <Sidebar />
          <SidebarInset className="w-full">
            {!hideNavbar && <Navbar />}
            <main className="flex-1 p-2 sm:p-4 md:p-6 overflow-auto w-full max-w-full">
              <div className="max-w-full overflow-x-hidden">
                {children || <Outlet />}
              </div>
              <Toaster />
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </UserPreferencesProvider>
  );
};

export default MainLayout;
