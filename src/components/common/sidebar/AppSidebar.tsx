
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel
} from '@/components/ui/sidebar';
import Logo from '@/components/common/Logo';
import { 
  LayoutDashboard, 
  Dog, 
  Users, 
  CalendarCheck,
  MessageSquare,
  Settings
} from 'lucide-react';

const AppSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const navigationItems = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard
    },
    {
      title: 'Dogs',
      path: '/dogs',
      icon: Dog
    },
    {
      title: 'Litters',
      path: '/litters',
      icon: Users
    },
    {
      title: 'Daily Care',
      path: '/dailycare',
      icon: CalendarCheck
    },
    {
      title: 'Customers',
      path: '/customers',
      icon: Users
    },
    {
      title: 'Communications',
      path: '/communications',
      icon: MessageSquare
    }
  ];
  
  const isActive = (path: string) => {
    return location.pathname === path || 
          (path === '/dashboard' && location.pathname === '/');
  };

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-center p-4">
        <Logo size="md" variant="primary" />
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    isActive={isActive(item.path)}
                    tooltip={item.title}
                    onClick={() => navigate(item.path)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <div className="flex items-center justify-center">
          <button 
            onClick={() => navigate('/settings')} 
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors p-2 rounded-md"
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
