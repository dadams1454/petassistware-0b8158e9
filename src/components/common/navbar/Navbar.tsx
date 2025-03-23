
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthProvider';
import NavbarLogo from './NavbarLogo';
import DesktopMenu from './DesktopMenu';
import UserMenu from './UserMenu';
import MobileMenuButton from './MobileMenuButton';
import MobileMenu from './MobileMenu';
import { getMenuItems } from './navbarUtils';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { signOut, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const menuItems = getMenuItems();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavbarLogo />
            <DesktopMenu 
              menuItems={menuItems} 
              currentPath={location.pathname} 
            />
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
        menuItems={menuItems} 
        currentPath={location.pathname} 
        user={user} 
        onLogout={handleLogout} 
        navigate={navigate}
        onItemClick={() => setIsMenuOpen(false)}
      />
    </nav>
  );
};

export default Navbar;
