
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

export const filterNavItemsByRole = (items: NavItem[], userRole: string | null): NavItem[] => {
  return userRole
    ? items.filter((item) => {
        if (!item.requiredRoles) return true;
        return item.requiredRoles.includes(userRole);
      })
    : items;
};
