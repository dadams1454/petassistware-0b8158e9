
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthProvider';
import { SidebarTrigger } from '@/components/ui/sidebar';
import NavbarLogo from './NavbarLogo';
import UserMenu from './UserMenu';
import MobileMenuButton from './MobileMenuButton';
import MobileMenu from './MobileMenu';
import ErrorBoundary from '@/components/ErrorBoundary';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useRefresh } from '@/contexts/refreshContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const { isRefreshing, handleRefresh, formatTimeRemaining } = useRefresh();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleRefreshClick = useCallback(() => {
    handleRefresh(true);
  }, [handleRefresh]);

  return (
    <ErrorBoundary name="Navbar">
      <nav className="bg-background border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <SidebarTrigger className="md:mr-4" />
              <div className="block md:hidden">
                <NavbarLogo />
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleRefreshClick}
                      disabled={isRefreshing}
                      className="mr-2"
                    >
                      <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                      {isRefreshing ? 'Refreshing...' : 'Refresh'}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Refresh all data</p>
                    <p className="text-xs">Auto-refresh in: {formatTimeRemaining()}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <UserMenu 
                user={user} 
                onLogout={handleLogout} 
                navigate={navigate} 
              />
            </div>
            
            <MobileMenuButton 
              isMenuOpen={isMenuOpen} 
              toggleMenu={toggleMenu} 
            />
          </div>
        </div>

        <MobileMenu 
          isOpen={isMenuOpen} 
          user={user} 
          onLogout={handleLogout} 
          navigate={navigate}
          onItemClick={() => setIsMenuOpen(false)}
        />
      </nav>
    </ErrorBoundary>
  );
};

export default Navbar;
