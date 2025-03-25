
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthProvider';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Home,
  Dog,
  Calendar,
  Users,
  MessageSquare,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  Shield
} from 'lucide-react';
import Logo from './Logo';

interface NavItem {
  name: string;
  to: string;
  icon: React.ReactNode;
  requiredRoles?: string[];
}

const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, userRole, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems: NavItem[] = [
    {
      name: 'Dashboard',
      to: '/dashboard',
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: 'Dogs',
      to: '/dogs',
      icon: <Dog className="h-5 w-5" />,
    },
    {
      name: 'Customers',
      to: '/customers',
      icon: <Users className="h-5 w-5" />,
      requiredRoles: ['staff', 'manager', 'admin'],
    },
    {
      name: 'Litters',
      to: '/litters',
      icon: <Dog className="h-5 w-5" />,
      requiredRoles: ['staff', 'manager', 'admin'],
    },
    {
      name: 'Calendar',
      to: '/calendar',
      icon: <Calendar className="h-5 w-5" />,
      requiredRoles: ['staff', 'manager', 'admin'],
    },
    {
      name: 'Communications',
      to: '/communications',
      icon: <MessageSquare className="h-5 w-5" />,
      requiredRoles: ['manager', 'admin'],
    },
    {
      name: 'Users',
      to: '/users',
      icon: <Shield className="h-5 w-5" />,
      requiredRoles: ['admin'],
    },
  ];

  // Filter nav items based on user role
  const filteredNavItems = userRole
    ? navItems.filter((item) => {
        if (!item.requiredRoles) return true;
        return item.requiredRoles.includes(userRole);
      })
    : navItems;

  return (
    <nav className="bg-background border-b">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/">
                <Logo />
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    location.pathname === item.to
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {item.icon}
                  <span className="ml-2">{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar>
                    <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <Button
              variant="ghost"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          {filteredNavItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                location.pathname === item.to
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-transparent text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                {item.icon}
                <span className="ml-2">{item.name}</span>
              </div>
            </Link>
          ))}
        </div>
        <div className="pt-4 pb-3 border-t">
          <div className="flex items-center px-4">
            <div className="flex-shrink-0">
              <Avatar>
                <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
              </Avatar>
            </div>
            <div className="ml-3">
              <div className="text-base font-medium">{user?.email}</div>
              <div className="text-sm font-medium text-muted-foreground">
                {userRole?.charAt(0).toUpperCase() + userRole?.slice(1) || 'User'}
              </div>
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <Link
              to="/profile"
              className="block px-4 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <User className="h-5 w-5" />
                <span className="ml-2">Profile</span>
              </div>
            </Link>
            <Link
              to="/settings"
              className="block px-4 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <Settings className="h-5 w-5" />
                <span className="ml-2">Settings</span>
              </div>
            </Link>
            <button
              onClick={() => {
                signOut();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <div className="flex items-center">
                <LogOut className="h-5 w-5" />
                <span className="ml-2">Log out</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
