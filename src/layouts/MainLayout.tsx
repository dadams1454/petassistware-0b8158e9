
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/common/Navbar';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
  withPadding?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  className,
  fullWidth = false,
  withPadding = true
}) => {
  const location = useLocation();
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main 
        className={cn(
          'flex-1 pt-20',
          withPadding && 'pb-16 px-4 md:px-6',
          className
        )}
      >
        <div className={cn(
          'mx-auto w-full animate-fade-in',
          fullWidth ? '' : 'max-w-7xl'
        )}>
          {children}
        </div>
      </main>
      
      <footer className="py-6 px-4 md:px-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} BreedElite. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
