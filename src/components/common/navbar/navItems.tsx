
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
  Building2,
  Coins,
  UserCog,
  ClipboardCheck,
  Scale,
  Baby,
  UserCircle,
  Database,
  Lock,
  Heart
} from 'lucide-react';

export const navItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Overview of all your kennel activities'
  },
  {
    title: 'Profile',
    href: '/profile',
    icon: UserCircle,
    description: 'Manage your profile settings'
  },
  {
    title: 'Dogs',
    href: '/dogs',
    icon: Dog,
    description: 'Manage your dogs and puppies'
  },
  {
    title: 'Reproduction',
    href: '/reproduction',
    icon: Heart,
    description: 'Manage breeding, litters, and whelping'
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
    icon: Building2,
    description: 'Manage facility, staff, and maintenance'
  },
  {
    title: 'Compliance',
    href: '/compliance',
    icon: Scale,
    description: 'Manage licenses and regulatory requirements'
  },
  // Admin section
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users,
    description: 'Manage user accounts and permissions',
    admin: true
  },
  {
    title: 'Audit Logs',
    href: '/admin/audit-logs',
    icon: Shield,
    description: 'View system activity logs',
    admin: true
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    description: 'Configure your application settings',
    admin: true
  },
  {
    title: 'Security',
    href: '/admin/security',
    icon: Lock,
    description: 'Manage RLS and JWT security settings',
    admin: true
  },
  {
    title: 'Schema',
    href: '/admin/schema',
    icon: Database,
    description: 'View database schema and relationships',
    admin: true
  },
  {
    title: 'Roles',
    href: '/admin/roles',
    icon: UserCog,
    description: 'Configure role-based access control',
    admin: true
  }
];

// Adding the missing functions that are being imported
export const getNavItems = () => {
  return navItems.map(item => ({
    name: item.title,
    to: item.href,
    icon: <item.icon className="h-5 w-5" />,
    description: item.description,
    admin: item.admin || false
  }));
};

export const filterNavItemsByRole = (items: ReturnType<typeof getNavItems>, role: string) => {
  // Filter out admin items for non-admin roles
  if (role !== 'admin' && role !== 'owner') {
    return items.filter(item => !item.admin);
  }
  return items;
};
