
import { Home, Dog as LucideDog, NotebookPen, Users, Calendar, MessageSquare } from 'lucide-react';
import React from 'react';

export interface MenuItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

export const getMenuItems = (): MenuItem[] => [
  {
    label: 'Dashboard',
    path: '/',
    icon: React.createElement(Home, { className: "h-5 w-5" })
  },
  {
    label: 'Dogs',
    path: '/dogs',
    icon: React.createElement(LucideDog, { className: "h-5 w-5" })
  },
  {
    label: 'Litters',
    path: '/litters',
    icon: React.createElement(NotebookPen, { className: "h-5 w-5" })
  },
  {
    label: 'Customers',
    path: '/customers',
    icon: React.createElement(Users, { className: "h-5 w-5" })
  },
  {
    label: 'Communications',
    path: '/communications',
    icon: React.createElement(MessageSquare, { className: "h-5 w-5" })
  },
  {
    label: 'Calendar',
    path: '/calendar',
    icon: React.createElement(Calendar, { className: "h-5 w-5" })
  }
];
