
import React from 'react';
import { TabsList as ShadcnTabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RefreshCw, Clock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TabsListProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  onRefreshDogs: () => void;
  isRefreshing: boolean;
  nextRefreshTime: string;
}

const TabsList: React.FC<TabsListProps> = ({
  activeTab,
  onTabChange,
  onRefreshDogs,
  isRefreshing,
  nextRefreshTime
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
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
      
      <div className="flex items-center gap-2">
        <span className="text-xs flex items-center gap-1 text-slate-500 dark:text-slate-400">
          <Clock className="h-3 w-3" />
          <span>Auto-refresh in: {nextRefreshTime}</span>
        </span>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={onRefreshDogs} 
                disabled={isRefreshing}
                variant="outline"
                size="sm"
                className="gap-1"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
                <span className="sr-only sm:not-sr-only sm:inline-block">
                  {isRefreshing ? 'Refreshing...' : 'Refresh Now'}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Manually refresh all dog data</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default TabsList;
