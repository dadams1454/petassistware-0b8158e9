
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, LayoutDashboard, Clock, Calendar, Dog, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TabsListProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  onRefreshDogs: () => void;
  isRefreshing: boolean;
}

const TabsListComponent: React.FC<TabsListProps> = ({
  activeTab,
  onTabChange,
  onRefreshDogs,
  isRefreshing,
}) => {
  return (
    <div className="flex justify-between items-center mb-4 w-full min-w-max">
      <TabsList className="grid grid-cols-5 w-auto min-w-[320px]">
        <TabsTrigger value="overview" onClick={() => onTabChange('overview')}>
          <LayoutDashboard className="mr-1 h-4 w-4" />
          <span className="hidden sm:inline">Overview</span>
        </TabsTrigger>
        <TabsTrigger value="dailycare" onClick={() => onTabChange('dailycare')}>
          <Clock className="mr-1 h-4 w-4" />
          <span className="hidden sm:inline">Daily Care</span>
        </TabsTrigger>
        <TabsTrigger value="dogletout" onClick={() => onTabChange('dogletout')}>
          <Dog className="mr-1 h-4 w-4" />
          <span className="hidden sm:inline">Dog Let Out</span>
        </TabsTrigger>
        <TabsTrigger value="events" onClick={() => onTabChange('events')}>
          <Calendar className="mr-1 h-4 w-4" />
          <span className="hidden sm:inline">Events</span>
        </TabsTrigger>
        <TabsTrigger value="reports" onClick={() => onTabChange('reports')}>
          <FileText className="mr-1 h-4 w-4" />
          <span className="hidden sm:inline">Reports</span>
        </TabsTrigger>
      </TabsList>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onRefreshDogs}
        disabled={isRefreshing}
        className="hidden sm:flex shrink-0 ml-2"
      >
        <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
        Refresh Data
      </Button>
    </div>
  );
};

export default TabsListComponent;
