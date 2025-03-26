import React from 'react';
import {
  Home,
  Dog,
  Calendar,
  Users,
  MessageSquare,
  Shield,
} from 'lucide-react';

export interface NavItem {
  name: string;
  to: string;
  icon: React.ReactNode;
  requiredRoles?: string[];
}

export const getNavItems = (): NavItem[] => [
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
    requiredRoles: ['staff', 'manager', 'admin', 'owner'],
  },
  {
    name: 'Litters',
    to: '/litters',
    icon: <Dog className="h-5 w-5" />,
    requiredRoles: ['staff', 'manager', 'admin', 'owner'],
  },
  {
    name: 'Calendar',
    to: '/calendar',
    icon: <Calendar className="h-5 w-5" />,
    requiredRoles: ['staff', 'manager', 'admin', 'owner'],
  },
  {
    name: 'Communications',
    to: '/communications',
    icon: <MessageSquare className="h-5 w-5" />,
    requiredRoles: ['manager', 'admin', 'owner'],
  },
  {
    name: 'Users',
    to: '/users',
    icon: <Shield className="h-5 w-5" />,
    requiredRoles: ['admin', 'owner'],
  },
];

export const filterNavItemsByRole = (items: NavItem[], userRole: string | null): NavItem[] => {
  // If no role is provided, show items with no role requirements
  if (!userRole) {
    return items.filter(item => !item.requiredRoles || item.requiredRoles.length === 0);
  }
  
  // Convert role to lowercase to handle case variations like 'Owner' vs 'owner'
  const normalizedRole = userRole.toLowerCase();
  
  // Return all items if user is admin or owner
  if (normalizedRole === 'admin' || normalizedRole === 'owner') {
    return items;
  }
  
  // Filter based on role
  return items.filter(item => {
    // If no required roles, show the item to everyone
    if (!item.requiredRoles) return true;
    
    // Otherwise, check if user's normalized role is in the required roles
    return item.requiredRoles.includes(normalizedRole);
  });
};
