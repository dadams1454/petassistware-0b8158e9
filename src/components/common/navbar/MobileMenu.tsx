
import React from 'react';
import { User } from '@supabase/supabase-js';
import { NavigateFunction } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MobileMenuProps {
  isOpen: boolean;
  user: User | null;
  onLogout: () => Promise<void>;
  navigate: NavigateFunction;
  onItemClick: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ 
  isOpen, 
  user, 
  onLogout, 
  navigate,
  onItemClick
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="md:hidden" id="mobile-menu">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background shadow-lg">
        {user ? (
          <div className="pt-2 pb-1">
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
              <button 
                onClick={() => {
                  navigate('/profile');
                  onItemClick();
                }} 
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-secondary hover:text-secondary-foreground"
              >
                Your Profile
              </button>
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
          <button 
            onClick={() => {
              navigate('/auth');
              onItemClick();
            }} 
            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-blue-500 hover:text-blue-700"
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
