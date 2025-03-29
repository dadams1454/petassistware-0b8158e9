import React from 'react';
import {
  LayoutDashboard,
  Dog,
  ClipboardCheck,
  Paw,
  Building2,
  Calendar,
  Users,
  BarChart2,
  Settings,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface SidebarLink {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const sidebarLinks: SidebarLink[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: 'Dogs',
    href: '/dogs',
    icon: <Dog className="h-5 w-5" />,
  },
  {
    title: 'Daily Care',
    href: '/daily-care',
    icon: <ClipboardCheck className="h-5 w-5" />,
  },
  {
    title: 'Litters',
    href: '/litters',
    icon: <Paw className="h-5 w-5" />,
  },
  {
    title: 'Facility',
    href: '/facility',
    icon: <Building2 className="h-5 w-5" />,
  },
  {
    title: 'Calendar',
    href: '/calendar',
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    title: 'Customers',
    href: '/customers',
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: 'Reports',
    href: '/reports',
    icon: <BarChart2 className="h-5 w-5" />,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: <Settings className="h-5 w-5" />,
  },
];

const SideNav: React.FC = () => {
  return (
    <div className="space-y-4 py-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          Kennel Management
        </h2>
        <div className="space-y-1">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.title}
              to={link.href}
              className={({ isActive }) =>
                `flex items-center gap-x-2 rounded-md px-4 py-2 text-sm font-semibold transition-colors hover:bg-secondary hover:text-secondary-foreground ${
                  isActive
                    ? 'bg-secondary text-secondary-foreground'
                    : 'text-muted-foreground'
                }`
              }
            >
              {link.icon}
              {link.title}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SideNav;
