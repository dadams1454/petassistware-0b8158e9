
import React from 'react';
import { TabsList as ShadcnTabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LayoutDashboard, 
  Calendar, 
  FileBarChart,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TabsListProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
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
    <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
      <ShadcnTabsList className="h-auto bg-transparent p-0 overflow-x-auto flex-wrap">
        <TabsTrigger 
          value="overview" 
          className={`transition-all ${activeTab === 'overview' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-card hover:bg-accent hover:text-accent-foreground'} px-3 py-2`}
          onClick={() => onTabChange('overview')}
        >
          <LayoutDashboard className="h-4 w-4 mr-2" />
          <span>Overview</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="dailycare" 
          className={`transition-all ${activeTab === 'dailycare' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-card hover:bg-accent hover:text-accent-foreground'} px-3 py-2`}
          onClick={() => onTabChange('dailycare')}
        >
          <Calendar className="h-4 w-4 mr-2" />
          <span>Daily Care</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="events" 
          className={`transition-all ${activeTab === 'events' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-card hover:bg-accent hover:text-accent-foreground'} px-3 py-2`}
          onClick={() => onTabChange('events')}
        >
          <Calendar className="h-4 w-4 mr-2" />
          <span>Events</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="reports" 
          className={`transition-all ${activeTab === 'reports' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-card hover:bg-accent hover:text-accent-foreground'} px-3 py-2`}
          onClick={() => onTabChange('reports')}
        >
          <FileBarChart className="h-4 w-4 mr-2" />
          <span>Reports</span>
        </TabsTrigger>
      </ShadcnTabsList>
      
      <Button 
        onClick={onRefreshDogs} 
        variant="outline" 
        size="sm" 
        className="gap-2"
        disabled={isRefreshing}
      >
        <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
        <span>Refresh</span>
      </Button>
    </div>
  );
};

export default TabsList;
