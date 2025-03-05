
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Logo from './Logo';
import { MenuIcon, X, User } from 'lucide-react';

const navLinks = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Dogs', path: '/dogs' },
  { name: 'Litters', path: '/litters' },
  { name: 'Sales', path: '/sales' },
  { name: 'Website', path: '/website' },
  { name: 'Reports', path: '/reports' },
];

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      isScrolled 
        ? 'py-2 bg-blur-lg shadow-subtle border-b border-slate-200/70 dark:border-slate-800/70' 
        : 'py-4 bg-transparent'
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all',
                  location.pathname === link.path
                    ? 'text-primary bg-primary/5 dark:bg-primary/20'
                    : 'text-slate-600 hover:text-primary hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full bg-white/80 hover:bg-white shadow-subtle border border-slate-200 transition-all hover:scale-105">
              <User size={18} className="text-slate-600" />
            </button>
            
            {/* Mobile menu button */}
            <button
              className="p-2 rounded-full bg-white/80 hover:bg-white shadow-subtle border border-slate-200 md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? (
                <X size={18} className="text-slate-600" />
              ) : (
                <MenuIcon size={18} className="text-slate-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={cn(
          'fixed inset-0 pt-20 pb-6 bg-white dark:bg-slate-900 z-40 transform transition-transform duration-300 ease-in-out md:hidden',
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <nav className="container h-full flex flex-col px-6 pb-20 overflow-y-auto hide-scrollbar">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'py-4 px-4 text-lg border-b border-slate-100 dark:border-slate-800',
                location.pathname === link.path
                  ? 'text-primary font-medium'
                  : 'text-slate-600 dark:text-slate-300'
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
