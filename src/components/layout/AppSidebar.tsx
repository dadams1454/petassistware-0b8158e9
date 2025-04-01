
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Dog,
  ClipboardList,
  Bookmark,
  Users,
  CalendarDays,
  Mail,
  FileText,
  Coins,
  Building2,
  Shield,
  Settings,
  Scale,
  UserCircle,
  Baby
} from 'lucide-react';
import Logo from '@/components/common/Logo';

const AppSidebar = () => {
  const location = useLocation();
  const { userRole } = useAuth();
  
  const mainMenuItems = [
    { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { title: 'Profile', href: '/profile', icon: UserCircle },
    { title: 'Dogs', href: '/dogs', icon: Dog },
    { title: 'Litters', href: '/litters', icon: ClipboardList },
    { title: 'Reservations', href: '/reservations', icon: Bookmark },
    { title: 'Customers', href: '/customers', icon: Users },
  ];
  
  const operationsMenuItems = [
    { title: 'Calendar', href: '/calendar', icon: CalendarDays },
    { title: 'Communications', href: '/communications', icon: Mail },
    { title: 'Contracts', href: '/contracts', icon: FileText },
    { title: 'Finances', href: '/finances', icon: Coins },
    { title: 'Facility', href: '/facility', icon: Building2 },
    { title: 'Compliance', href: '/compliance', icon: Scale },
    { title: 'Breeding Prep', href: '/breeding-prep', icon: ClipboardList },
    { title: 'Welping', href: '/welping-dashboard', icon: Baby },
  ];
  
  const adminMenuItems = [
    { title: 'Users', href: '/users', icon: Users },
    { title: 'Audit Logs', href: '/audit-logs', icon: Shield },
    { title: 'Settings', href: '/admin-setup', icon: Settings },
  ];
  
  // Only show admin items to admins or owners
  const showAdminItems = userRole === 'admin' || userRole === 'owner';
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link to="/dashboard" className="flex items-center gap-2">
          <Logo />
        </Link>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={isActive(item.href)}
                    tooltip={item.title}
                    asChild
                  >
                    <Link to={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Operations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {operationsMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={isActive(item.href)}
                    tooltip={item.title}
                    asChild
                  >
                    <Link to={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {showAdminItems && (
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminMenuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={isActive(item.href)}
                      tooltip={item.title}
                      asChild
                    >
                      <Link to={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <div className="text-xs text-muted-foreground">
          Bear Paw Newfoundlands
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
