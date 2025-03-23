
import React from 'react';
import { Link } from 'react-router-dom';
import { MenuItem } from './navbarUtils';

interface DesktopMenuProps {
  menuItems: MenuItem[];
  currentPath: string;
}

const DesktopMenu: React.FC<DesktopMenuProps> = ({ menuItems, currentPath }) => {
  return (
    <div className="hidden md:block">
      <div className="ml-10 flex items-baseline space-x-4">
        {menuItems.map(item => (
          <Link 
            key={item.label} 
            to={item.path}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              (currentPath === item.path || 
              (item.path === '/' && currentPath === '/dashboard'))
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
  );
};

export default DesktopMenu;
