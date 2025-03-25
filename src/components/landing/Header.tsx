
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Logo from '@/components/common/Logo';
import { CustomButton } from '@/components/ui/custom-button';
import { useAuth } from '@/contexts/AuthProvider';
import LogoutButton from './LogoutButton';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      isScrolled 
        ? 'py-3 bg-blur-lg shadow-subtle border-b border-slate-200/70 dark:border-slate-800/70' 
        : 'py-5 bg-transparent'
    )}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="transition-transform duration-300 hover:scale-105"
            aria-label="Go to homepage"
          >
            <Logo />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="#features"
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-primary"
            >
              Features
            </Link>
            <Link
              to="#pricing"
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-primary"
            >
              Pricing
            </Link>
            <Link
              to="#testimonials"
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-primary"
            >
              Testimonials
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link to="/dashboard">
                  <CustomButton
                    variant="primary"
                    size="sm"
                  >
                    Dashboard
                  </CustomButton>
                </Link>
                <LogoutButton />
              </>
            ) : (
              <>
                <Link to="/auth">
                  <CustomButton
                    variant="outline"
                    size="sm"
                  >
                    Log in
                  </CustomButton>
                </Link>
                <Link to="/auth">
                  <CustomButton
                    variant="primary"
                    size="sm"
                  >
                    Get Started
                  </CustomButton>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
