
import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthProvider';
import Logo from '../Logo';
import NavLinks from './NavLinks';
import MobileMenu from './MobileMenu';
import MobileMenuContent from './MobileMenuContent';
import UserMenu from './UserMenu';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, userRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b w-full px-4 py-2">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex-shrink-0">
              <Logo />
            </Link>
          </div>
          
          <div className="hidden md:flex md:items-center md:space-x-1">
            <NavLinks currentPath={location.pathname} userRole={userRole} />
          </div>
          
          <div className="hidden md:flex md:items-center">
            <UserMenu />
          </div>
          
          <div className="md:hidden">
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
