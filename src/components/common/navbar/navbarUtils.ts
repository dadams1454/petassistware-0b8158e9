
import {
  LayoutDashboard,
  Dog,
  Users,
  MessageSquare,
} from 'lucide-react';

export type MenuItem = {
  label: string;
  path: string;
  icon: string;
};

export type LucideIcon =
  | typeof LayoutDashboard
  | typeof Dog
  | typeof Users
  | typeof MessageSquare;

export const getMenuItems = () => {
  return [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'LayoutDashboard',
    },
    {
      label: 'Dogs',
      path: '/dogs',
      icon: 'Dog',
    },
    {
      label: 'Litters',
      path: '/litters',
      icon: 'Users',
    },
    {
      label: 'Customers',
      path: '/customers',
      icon: 'Users',
    },
    {
      label: 'Communications',
      path: '/communications',
      icon: 'MessageSquare',
    },
  ];
};
