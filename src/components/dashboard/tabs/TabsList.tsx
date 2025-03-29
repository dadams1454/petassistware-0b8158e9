
import React from 'react';
import { Tabs, TabsList as ShadcnTabsList, TabsTrigger } from '@/components/ui/tabs';
import { Home, Calendar, BarChart3, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface TabsListProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  onRefreshDogs: () => void;
  isRefreshing?: boolean;
}

const TabsList: React.FC<TabsListProps> = ({ 
  activeTab, 
  onTabChange,
  onRefreshDogs,
  isRefreshing = false
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
      <ShadcnTabsList className="mb-0 h-auto p-1 bg-background border overflow-x-auto max-w-full flex-wrap">
        <TabsTrigger 
          value="overview" 
          className="gap-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
          onClick={() => onTabChange('overview')}
          data-state={activeTab === 'overview' ? 'active' : 'inactive'}
        >
          <Home className="h-4 w-4" />
          <span>Overview</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="dailycare" 
          className="gap-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
          onClick={() => onTabChange('dailycare')}
          data-state={activeTab === 'dailycare' ? 'active' : 'inactive'}
        >
          <FileText className="h-4 w-4" />
          <span>Daily Care</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="events" 
          className="gap-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
          onClick={() => onTabChange('events')}
          data-state={activeTab === 'events' ? 'active' : 'inactive'}
        >
          <Calendar className="h-4 w-4" />
          <span>Events</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="reports" 
          className="gap-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
          onClick={() => onTabChange('reports')}
          data-state={activeTab === 'reports' ? 'active' : 'inactive'}
        >
          <BarChart3 className="h-4 w-4" />
          <span>Reports</span>
        </TabsTrigger>
      </ShadcnTabsList>
      
      <Button
        onClick={onRefreshDogs}
        variant="outline"
        size="sm"
        className="flex items-center gap-1.5 h-9 ml-auto"
        disabled={isRefreshing}
      >
        <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        <span>Refresh</span>
      </Button>
    </div>
  );
};

export default TabsList;
