
import React from 'react';
import { Tabs, TabsList as ShadcnTabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LayoutDashboard, 
  Calendar, 
  Dog,
  FileBarChart,
  RefreshCw,
  Building2,
  Baby,
  GraduationCap
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
    <div className="flex justify-between items-center mb-6 flex-wrap gap-3 w-full">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <ShadcnTabsList className="h-auto bg-transparent p-0 overflow-x-auto flex-wrap w-full">
          <TabsTrigger 
            value="overview" 
            className={`transition-all ${activeTab === 'overview' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-card hover:bg-accent hover:text-accent-foreground'} px-3 py-2`}
          >
            <LayoutDashboard className="h-4 w-4 mr-2" />
            <span>Overview</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="dailycare" 
            className={`transition-all ${activeTab === 'dailycare' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-card hover:bg-accent hover:text-accent-foreground'} px-3 py-2`}
          >
            <Calendar className="h-4 w-4 mr-2" />
            <span>Daily Care</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="dogletout" 
            className={`transition-all ${activeTab === 'dogletout' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-card hover:bg-accent hover:text-accent-foreground'} px-3 py-2`}
          >
            <Dog className="h-4 w-4 mr-2" />
            <span>Dog Let Out</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="puppies" 
            className={`transition-all ${activeTab === 'puppies' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-card hover:bg-accent hover:text-accent-foreground'} px-3 py-2`}
          >
            <Baby className="h-4 w-4 mr-2" />
            <span>Puppies</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="training" 
            className={`transition-all ${activeTab === 'training' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-card hover:bg-accent hover:text-accent-foreground'} px-3 py-2`}
          >
            <GraduationCap className="h-4 w-4 mr-2" />
            <span>Training</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="facility" 
            className={`transition-all ${activeTab === 'facility' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-card hover:bg-accent hover:text-accent-foreground'} px-3 py-2`}
          >
            <Building2 className="h-4 w-4 mr-2" />
            <span>Facility</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="events" 
            className={`transition-all ${activeTab === 'events' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-card hover:bg-accent hover:text-accent-foreground'} px-3 py-2`}
          >
            <Calendar className="h-4 w-4 mr-2" />
            <span>Events</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="reports" 
            className={`transition-all ${activeTab === 'reports' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-card hover:bg-accent hover:text-accent-foreground'} px-3 py-2`}
          >
            <FileBarChart className="h-4 w-4 mr-2" />
            <span>Reports</span>
          </TabsTrigger>
        </ShadcnTabsList>
      </Tabs>
      
      <div className="flex-shrink-0 ml-auto">
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
    </div>
  );
};

export default TabsList;
