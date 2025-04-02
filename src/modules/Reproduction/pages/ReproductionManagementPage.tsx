
import React, { useState } from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageContainer from '@/components/common/PageContainer';
import { SectionHeader } from '@/components/ui/standardized';
import { 
  Baby, 
  Heart, 
  Calendar, 
  Stethoscope,
  LucideIcon
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface NavigationItem {
  label: string;
  value: string;
  path: string;
  icon: React.ReactNode;
  description: string;
}

const ReproductionManagementPage: React.FC = () => {
  const location = useLocation();
  const { toast } = useToast();
  
  // Extract the active tab from the current URL path
  const getActiveTabFromPath = () => {
    const path = location.pathname.split('/');
    const section = path[2] || 'dashboard';
    return section;
  };
  
  const [activeTab, setActiveTab] = useState<string>(getActiveTabFromPath());
  
  const navigationItems: NavigationItem[] = [
    {
      label: 'Dashboard',
      value: 'dashboard',
      path: '/reproduction/dashboard',
      icon: <Calendar className="h-6 w-6 mb-2 text-blue-500" />,
      description: 'Overview of all reproductive activities'
    },
    {
      label: 'Breeding',
      value: 'breeding',
      path: '/reproduction/breeding',
      icon: <Heart className="h-6 w-6 mb-2 text-pink-500" />,
      description: 'Manage breeding plans and records'
    },
    {
      label: 'Whelping',
      value: 'welping',
      path: '/reproduction/welping',
      icon: <Stethoscope className="h-6 w-6 mb-2 text-purple-500" />,
      description: 'Manage whelping sessions and protocols'
    },
    {
      label: 'Litters',
      value: 'litters',
      path: '/reproduction/litters',
      icon: <Baby className="h-6 w-6 mb-2 text-green-500" />,
      description: 'Track litters and puppies'
    }
  ];
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const navigationItem = navigationItems.find(item => item.value === value);
    
    if (!navigationItem) {
      // Fallback to dashboard if no matching tab
      toast({
        title: "Navigation Error",
        description: "Could not find the requested section. Redirecting to dashboard.",
        variant: "destructive"
      });
      return;
    }
  };
  
  if (location.pathname === '/reproduction') {
    // Redirect to dashboard if only base path is accessed
    return <Navigate to="/reproduction/dashboard" replace />;
  }
  
  return (
    <PageContainer>
      <div className="container mx-auto py-6">
        <SectionHeader
          title="Reproduction Management"
          description="Manage breeding, whelping, and litters in one central place"
        />
        
        <Tabs 
          value={activeTab} 
          onValueChange={handleTabChange} 
          className="mt-6"
        >
          <TabsList className="grid grid-cols-4 w-full">
            {navigationItems.map((item) => (
              <Link 
                key={item.value} 
                to={item.path} 
                className="w-full"
              >
                <TabsTrigger 
                  value={item.value}
                  className="w-full"
                >
                  {item.label}
                </TabsTrigger>
              </Link>
            ))}
          </TabsList>
        </Tabs>
        
        {/* Display main cards if we're on the dashboard */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {navigationItems.filter(item => item.value !== 'dashboard').map((item) => (
              <Link key={item.value} to={item.path}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="pt-6 text-center">
                    <div className="flex flex-col items-center">
                      {item.icon}
                      <h3 className="text-lg font-medium">{item.label}</h3>
                      <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
        
        {/* Outlet for nested routes */}
        <div className="mt-6">
          <Outlet />
        </div>
      </div>
    </PageContainer>
  );
};

export default ReproductionManagementPage;
