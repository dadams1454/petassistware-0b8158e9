
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/common/Navbar';
import { Sidebar, SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { UserPreferencesProvider } from '@/contexts/UserPreferencesContext';

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <UserPreferencesProvider>
      <SidebarProvider defaultOpen={true}>
        <div className="flex h-screen overflow-hidden bg-background">
          <Sidebar />
          <SidebarInset>
            <Navbar />
            <main className="flex-1 p-4 md:p-6 overflow-auto">
              {children || <Outlet />}
              <Toaster />
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </UserPreferencesProvider>
  );
};

export default MainLayout;
