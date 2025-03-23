import React, { useState } from 'react';
import { Home, Dog as LucideDog, NotebookPen, Users, Calendar, Menu, X, MessageSquare } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthProvider';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    signOut,
    user
  } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [{
    label: 'Dashboard',
    path: '/', // Changed from '/dashboard' to '/' to match route in App.tsx
    icon: <Home className="h-5 w-5" />
  }, {
    label: 'Dogs',
    path: '/dogs',
    icon: <LucideDog className="h-5 w-5" />
  }, {
    label: 'Litters',
    path: '/litters',
    icon: <NotebookPen className="h-5 w-5" />
  }, {
    label: 'Customers',
    path: '/customers',
    icon: <Users className="h-5 w-5" />
  }, {
    label: 'Communications',
    path: '/communications',
    icon: <MessageSquare className="h-5 w-5" />
  }, {
    label: 'Calendar',
    path: '/calendar',
    icon: <Calendar className="h-5 w-5" />
  }];

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
            <Link to="/" className="flex-shrink-0 font-bold text-xl">
              Bear Paw Kennels
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {menuItems.map(item => (
                  <Link 
                    key={item.label} 
                    to={item.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      (location.pathname === item.path || 
                       (item.path === '/' && location.pathname === '/dashboard'))
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-foreground hover:bg-secondary hover:text-secondary-foreground'
                    } transition-colors duration-200`}
                  >
                    <span className="flex items-center">
                      <span className="hidden lg:block mr-2">{item.icon}</span>
                      {item.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.user_metadata?.avatar_url as string} alt={user?.email as string} />
                        <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" alignOffset={8} forceMount>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/auth" className="text-blue-500 hover:text-blue-700">
                  Login
                </Link>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button 
              onClick={toggleMenu} 
              type="button" 
              className="bg-background inline-flex items-center justify-center p-2 rounded-md text-foreground hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-controls="mobile-menu" 
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background shadow-lg">
          {menuItems.map(item => (
            <Link 
              key={item.label} 
              to={item.path} 
              className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === item.path 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-foreground hover:bg-secondary hover:text-secondary-foreground'
              }`}
              onClick={() => setIsMenuOpen(false)}
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
                  onClick={() => setIsMenuOpen(false)}
                >
                  Your Profile
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
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
              onClick={()={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
