
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { UserPreferencesProvider } from '@/contexts/UserPreferencesContext';
import { SidebarProvider, SidebarTrigger, SidebarRail, SidebarInset } from '@/components/ui/sidebar';
import UserMenu from '@/components/common/navbar/UserMenu';
import Sidebar from '@/components/common/Sidebar';
import { ThemeProvider } from '@/components/theme-provider';

interface MainLayoutProps {
  children?: React.ReactNode;
  hideNavbar?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, hideNavbar = false }) => {
  return (
    <ThemeProvider>
      <UserPreferencesProvider>
        <SidebarProvider>
          <div className="flex h-screen overflow-hidden bg-background w-full text-foreground">
            {!hideNavbar && <Sidebar />}
            <SidebarRail />
            <SidebarInset className="flex flex-col w-full">
              <header className="border-b p-4 flex justify-between items-center bg-card text-card-foreground">
                <div className="flex items-center gap-2">
                  <SidebarTrigger />
                  <h1 className="text-xl font-semibold">Bear Paw Newfoundlands</h1>
                </div>
                <UserMenu />
              </header>
              <main className="flex-1 overflow-auto w-full bg-background">
                {children || <Outlet />}
              </main>
            </SidebarInset>
            <Toaster />
          </div>
        </SidebarProvider>
      </UserPreferencesProvider>
    </ThemeProvider>
  );
};

export default MainLayout;
