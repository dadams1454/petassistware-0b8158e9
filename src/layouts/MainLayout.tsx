
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/common/Navbar';
import AppSidebar from '@/components/common/sidebar/AppSidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { UserPreferencesProvider } from '@/contexts/UserPreferencesContext';
import ErrorBoundary from '@/components/ErrorBoundary';

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <ErrorBoundary name="MainLayout">
      <UserPreferencesProvider>
        <SidebarProvider defaultOpen={true}>
          <div className="flex h-screen overflow-hidden bg-background">
            <AppSidebar />
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
    </ErrorBoundary>
  );
};

export default MainLayout;
