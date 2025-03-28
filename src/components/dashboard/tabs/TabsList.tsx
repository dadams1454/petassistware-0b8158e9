
import React from 'react';
import { TabsList as ShadcnTabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layout, CalendarDays, Dog, Activity, ScrollText, Baby } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TabsListProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  onRefreshDogs: () => void;
  isRefreshing: boolean;
}

const TabsList: React.FC<TabsListProps> = ({
  activeTab,
  onTabChange,
  onRefreshDogs,
  isRefreshing
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-2 mb-4">
      <ShadcnTabsList className="h-auto grid grid-cols-3 sm:grid-cols-6 gap-1">
        <TabsTrigger value="overview" onClick={() => onTabChange('overview')}>
          <Layout className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Overview</span>
        </TabsTrigger>
        
        <TabsTrigger value="dailycare" onClick={() => onTabChange('dailycare')}>
          <CalendarDays className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Daily Care</span>
        </TabsTrigger>
        
        <TabsTrigger value="dogletout" onClick={() => onTabChange('dogletout')}>
          <Dog className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Dog Let Out</span>
        </TabsTrigger>
        
        <TabsTrigger value="puppies" onClick={() => onTabChange('puppies')}>
          <Baby className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Puppies</span>
        </TabsTrigger>
        
        <TabsTrigger value="events" onClick={() => onTabChange('events')}>
          <Activity className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Events</span>
        </TabsTrigger>
        
        <TabsTrigger value="reports" onClick={() => onTabChange('reports')}>
          <ScrollText className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Reports</span>
        </TabsTrigger>
      </ShadcnTabsList>
    </div>
  );
};

export default TabsList;
