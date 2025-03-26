
import React from 'react';
import { Link } from 'react-router-dom';
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
  const navItems = getNavItems();
  const filteredNavItems = filterNavItemsByRole(navItems, userRole);

  return (
    <div className="sm:hidden">
      <div className="pt-2 pb-3 space-y-1">
        {filteredNavItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`block pl-3 pr-4 py-2 text-base font-medium ${
              currentPath === item.to
                ? 'bg-primary/10 border-l-4 border-primary text-primary'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
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
    </div>
  );
};

export default MobileMenuContent;
