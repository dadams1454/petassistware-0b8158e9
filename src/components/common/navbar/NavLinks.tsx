
import React from 'react';
import { Link } from 'react-router-dom';
import { getNavItems, filterNavItemsByRole } from './navItems';

interface NavLinksProps {
  currentPath: string;
  userRole: string | null;
}

const NavLinks: React.FC<NavLinksProps> = ({ currentPath, userRole }) => {
  const navItems = getNavItems();
  
  // This was likely the source of the issue - ensure we're properly filtering
  // based on userRole or showing all items if no role restrictions exist
  const filteredNavItems = filterNavItemsByRole(navItems, userRole || 'guest');

  return (
    <>
      {filteredNavItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
            currentPath === item.to
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {item.icon}
          <span className="ml-2">{item.name}</span>
        </Link>
      ))}
    </>
  );
};

export default NavLinks;
