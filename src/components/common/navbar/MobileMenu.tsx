
import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { NavigateFunction } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MenuItem } from './navbarUtils';

interface MobileMenuProps {
  isOpen: boolean;
  menuItems: MenuItem[];
  currentPath: string;
  user: User | null;
  onLogout: () => Promise<void>;
  navigate: NavigateFunction;
  onItemClick: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ 
  isOpen, 
  menuItems, 
  currentPath, 
  user, 
  onLogout, 
  navigate,
  onItemClick
}) => {
  return (
    <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`} id="mobile-menu">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background shadow-lg">
        {menuItems.map(item => (
          <Link 
            key={item.label} 
            to={item.path} 
            className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
              currentPath === item.path 
                ? 'bg-primary text-primary-foreground' 
                : 'text-foreground hover:bg-secondary hover:text-secondary-foreground'
            }`}
            onClick={onItemClick}
          >
            <div className="flex items-center">
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </div>
          </Link>
        ))}
        
        {user ? (
          <div className="pt-4 pb-1 border-t border-border">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.user_metadata?.avatar_url as string} alt={user?.email as string} />
                  <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium leading-none text-foreground">{user.email}</div>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <Link 
                to="/profile" 
                className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-secondary hover:text-secondary-foreground"
                onClick={onItemClick}
              >
                Your Profile
              </Link>
              <button 
                onClick={() => {
                  onLogout();
                  onItemClick();
                }} 
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-secondary hover:text-secondary-foreground"
              >
                Sign out
              </button>
            </div>
          </div>
        ) : (
          <Link 
            to="/auth" 
            className="block px-3 py-2 rounded-md text-base font-medium text-blue-500 hover:text-blue-700"
            onClick={onItemClick}
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
