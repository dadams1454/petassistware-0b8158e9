import {
  LayoutDashboard,
  Paw,
  Users,
  CalendarCheck,
  MessageSquare,
} from 'lucide-react';

type MenuItem = {
  label: string;
  path: string;
  icon: LucideIcon;
};

type LucideIcon =
  | typeof LayoutDashboard
  | typeof Paw
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
      icon: 'Paw',
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
