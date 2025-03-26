
import React from 'react';
import { Link } from 'react-router-dom';
import { getNavItems, filterNavItemsByRole } from './navItems';
import UserMenu from './UserMenu';

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
  const navItems = getNavItems();
  const filteredNavItems = filterNavItemsByRole(navItems, userRole || 'guest');

  return (
    <div className="sm:hidden px-2 pt-2 pb-3 space-y-1">
      {filteredNavItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className={`block px-3 py-2 rounded-md text-base font-medium ${
            currentPath === item.to
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
          onClick={onClose}
        >
          <div className="flex items-center">
            {item.icon}
            <span className="ml-2">{item.name}</span>
          </div>
        </Link>
      ))}
      
      <div className="pt-4 pb-3 border-t border-muted">
        <div className="px-3">
          <UserMenu />
        </div>
      </div>
    </div>
  );
};

export default MobileMenuContent;
