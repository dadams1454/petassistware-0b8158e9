
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthProvider';
import { SidebarTrigger } from '@/components/ui/sidebar';
import NavbarLogo from './NavbarLogo';
import UserMenu from './UserMenu';
import MobileMenuButton from './MobileMenuButton';
import MobileMenu from './MobileMenu';
import ErrorBoundary from '@/components/ErrorBoundary';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

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
            
            <div className="hidden md:block">
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
