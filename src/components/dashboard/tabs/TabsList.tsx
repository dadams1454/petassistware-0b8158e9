
import React from 'react';
import { TabsList as ShadcnTabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

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
    <div className="flex justify-between items-center mb-4">
      <ShadcnTabsList>
        <TabsTrigger value="overview" onClick={() => onTabChange('overview')}>
          Overview
        </TabsTrigger>
        <TabsTrigger value="dailycare" onClick={() => onTabChange('dailycare')}>
          Daily Care
        </TabsTrigger>
        <TabsTrigger value="grooming" onClick={() => onTabChange('grooming')}>
          Grooming
        </TabsTrigger>
      </ShadcnTabsList>
      
      <Button 
        onClick={onRefreshDogs} 
        disabled={isRefreshing}
        variant="outline"
        size="sm"
        className="gap-1"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        {isRefreshing ? 'Refreshing...' : 'Refresh Dogs'}
      </Button>
    </div>
  );
};

export default TabsList;
