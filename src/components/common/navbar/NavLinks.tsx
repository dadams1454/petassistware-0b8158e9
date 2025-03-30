
import React from 'react';
import { Link } from 'react-router-dom';
import { getNavItems, filterNavItemsByRole } from './navItems';

interface NavLinksProps {
  currentPath: string;
  userRole: string | null;
}

const NavLinks: React.FC<NavLinksProps> = ({ currentPath, userRole }) => {
  const navItems = getNavItems();
  
  // Apply role-based filtering with normalized roles
  const filteredNavItems = filterNavItemsByRole(navItems, userRole || 'guest');

  return (
    <>
      {filteredNavItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
            currentPath === item.to
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
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
