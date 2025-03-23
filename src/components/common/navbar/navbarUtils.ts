
import {
  LayoutDashboard,
  Dog,
  Users,
  CalendarCheck,
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
  | typeof CalendarCheck
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
      label: 'Daily Care',
      path: '/dailycare',
      icon: 'CalendarCheck',
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
