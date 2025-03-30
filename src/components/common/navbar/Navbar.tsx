
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
      <div className="flex items-center justify-between h-14">
        <div className="flex items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/dashboard" className="flex items-center gap-2">
              <Logo />
              <span className="text-lg font-semibold">Pet Assist Ware</span>
            </Link>
          </div>
          <div className="hidden md:ml-10 md:flex md:space-x-8">
            <NavLinks currentPath={location.pathname} userRole={userRole} />
          </div>
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
