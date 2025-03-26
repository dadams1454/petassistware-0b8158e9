
import React from 'react';
import {
  Home,
  Dog,
  Calendar,
  Users,
  MessageSquare,
  Shield,
  Settings,
} from 'lucide-react';
import { PERMISSIONS, hasPermission } from '@/utils/permissions';
import { UserRole } from '@/contexts/AuthProvider';

export interface NavItem {
  name: string;
  to: string;
  icon: React.ReactNode;
  resource: keyof typeof PERMISSIONS;
  action?: 'view' | 'add' | 'edit' | 'delete';
}

export const getNavItems = (): NavItem[] => [
  {
    name: 'Dashboard',
    to: '/dashboard',
    icon: <Home className="h-5 w-5" />,
    resource: 'dogs', // Using dogs as a proxy for dashboard
  },
  {
    name: 'Dogs',
    to: '/dogs',
    icon: <Dog className="h-5 w-5" />,
    resource: 'dogs',
  },
  {
    name: 'Customers',
    to: '/customers',
    icon: <Users className="h-5 w-5" />,
    resource: 'customers',
  },
  {
    name: 'Litters',
    to: '/litters',
    icon: <Dog className="h-5 w-5" />,
    resource: 'litters',
  },
  {
    name: 'Calendar',
    to: '/calendar',
    icon: <Calendar className="h-5 w-5" />,
    resource: 'calendar',
  },
  {
    name: 'Communications',
    to: '/communications',
    icon: <MessageSquare className="h-5 w-5" />,
    resource: 'communications',
  },
  {
    name: 'Users',
    to: '/users',
    icon: <Shield className="h-5 w-5" />,
    resource: 'users',
  },
  {
    name: 'Admin Setup',
    to: '/admin-setup',
    icon: <Settings className="h-5 w-5" />,
    resource: 'adminSetup',
  },
];

export const filterNavItemsByRole = (items: NavItem[], userRole: string | null): NavItem[] => {
  if (!userRole) {
    // If no role is provided, only show items that are accessible to everyone
    return items.filter(item => 
      PERMISSIONS[item.resource]?.view.includes('user') || 
      false
    );
  }
  
  // Convert role to lowercase to handle case variations
  const normalizedRole = userRole.toLowerCase() as UserRole;
  
  // Filter based on permissions
  return items.filter(item => 
    hasPermission(normalizedRole, item.resource, item.action || 'view')
  );
};
