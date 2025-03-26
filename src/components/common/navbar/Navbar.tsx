
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthProvider';
import Logo from '../Logo';
import NavLinks from './NavLinks';
import MobileMenu from './MobileMenu';
import MobileMenuContent from './MobileMenuContent';
import UserMenu from './UserMenu';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { userRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-background border-b">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Logo />
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLinks currentPath={location.pathname} userRole={userRole} />
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <UserMenu />
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <MobileMenu 
              isOpen={mobileMenuOpen} 
              onToggle={() => setMobileMenuOpen(!mobileMenuOpen)} 
            />
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <MobileMenuContent 
          currentPath={location.pathname} 
          userRole={userRole} 
          onClose={() => setMobileMenuOpen(false)} 
        />
      )}
    </nav>
  );
};

export default Navbar;
