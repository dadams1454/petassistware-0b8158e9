
import { 
  LayoutDashboard, 
  Dog, 
  CalendarDays, 
  Shield, 
  Mail, 
  Users,
  Settings,
  FileText,
  ClipboardList,
  Bookmark,
  Building,
  Coins,
  ClipboardCheck
} from 'lucide-react';

export const navItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Overview of all your kennel activities'
  },
  {
    title: 'Dogs',
    href: '/dogs',
    icon: Dog,
    description: 'Manage your dogs and puppies'
  },
  {
    title: 'Litters',
    href: '/litters',
    icon: ClipboardList,
    description: 'Manage your litters and puppies'
  },
  {
    title: 'Reservations',
    href: '/reservations',
    icon: Bookmark,
    description: 'Manage puppy reservations and deposits'
  },
  {
    title: 'Customers',
    href: '/customers',
    icon: Users,
    description: 'Manage your customer database'
  },
  {
    title: 'Calendar',
    href: '/calendar',
    icon: CalendarDays,
    description: 'Schedule appointments and events'
  },
  {
    title: 'Communications',
    href: '/communications',
    icon: Mail,
    description: 'Email and message your customers'
  },
  {
    title: 'Contracts',
    href: '/contracts',
    icon: FileText,
    description: 'Create and manage contracts'
  },
  {
    title: 'Finances',
    href: '/finances',
    icon: Coins,
    description: 'Track expenses and income'
  },
  {
    title: 'Facility',
    href: '/facility',
    icon: Building,
    description: 'Manage facility tasks and maintenance'
  },
  {
    title: 'Care Management',
    href: '/daily-care',
    icon: ClipboardCheck,
    description: 'Manage and assign care tasks'
  },
  {
    title: 'Users',
    href: '/users',
    icon: Users,
    description: 'Manage user accounts and permissions'
  },
  {
    title: 'Audit Log',
    href: '/audit-logs',
    icon: Shield,
    description: 'View system activity logs'
  },
  {
    title: 'Settings',
    href: '/admin-setup',
    icon: Settings,
    description: 'Configure your kennel settings'
  }
];

// Adding the missing functions that are being imported
export const getNavItems = () => {
  return navItems.map(item => ({
    name: item.title,
    to: item.href,
    icon: <item.icon className="h-5 w-5" />,
    description: item.description
  }));
};

export const filterNavItemsByRole = (items: ReturnType<typeof getNavItems>, role: string) => {
  // For now, we're not filtering by role, but the function is here for future use
  return items;
};
