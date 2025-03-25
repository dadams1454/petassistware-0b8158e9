
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Settings, Settings2, LogOut } from 'lucide-react';
import { getNavItems, filterNavItemsByRole } from './navItems';

interface MobileMenuContentProps {
  currentPath: string;
  userRole: string | null;
  onClose: () => void;
}

const MobileMenuContent: React.FC<MobileMenuContentProps> = ({ 
  currentPath, 
  userRole, 
  onClose 
}) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  
  const navItems = getNavItems();
  const filteredNavItems = filterNavItemsByRole(navItems, userRole);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Success",
        description: "You've been signed out successfully.",
      });
      navigate('/auth');
      onClose();
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: `Failed to sign out: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="sm:hidden">
      <div className="pt-2 pb-3 space-y-1">
        {filteredNavItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              currentPath === item.to
                ? 'border-primary text-primary bg-primary/5'
                : 'border-transparent text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
            onClick={onClose}
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
            onClick={onClose}
          >
            <div className="flex items-center">
              <User className="h-5 w-5" />
              <span className="ml-2">Profile</span>
            </div>
          </Link>
          <Link
            to="/settings"
            className="block px-4 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
            onClick={onClose}
          >
            <div className="flex items-center">
              <Settings className="h-5 w-5" />
              <span className="ml-2">Settings</span>
            </div>
          </Link>
          <Link
            to="/admin-setup"
            className="block px-4 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
            onClick={onClose}
          >
            <div className="flex items-center">
              <Settings2 className="h-5 w-5" />
              <span className="ml-2">Admin Setup</span>
            </div>
          </Link>
          <button
            onClick={handleSignOut}
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
  );
};

export default MobileMenuContent;
