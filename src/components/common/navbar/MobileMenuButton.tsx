
import React from 'react';
import { Menu, X } from 'lucide-react';

interface MobileMenuButtonProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({ isMenuOpen, toggleMenu }) => {
  return (
    <div className="-mr-2 flex md:hidden">
      <button 
        onClick={toggleMenu} 
        type="button" 
        className="bg-background inline-flex items-center justify-center p-2 rounded-md text-foreground hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        aria-controls="mobile-menu" 
        aria-expanded={isMenuOpen}
      >
        <span className="sr-only">Open main menu</span>
        {isMenuOpen ? (
          <X className="block h-6 w-6" aria-hidden="true" />
        ) : (
          <Menu className="block h-6 w-6" aria-hidden="true" />
        )}
      </button>
    </div>
  );
};

export default MobileMenuButton;
