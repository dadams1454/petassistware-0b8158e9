
import React from 'react';
import { Button } from '@/components/ui/button';
import { TabsList as ShadcnTabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, LayoutDashboard, CalendarClock, Pill, Scissors, Heart, Utensils, PawPrint } from 'lucide-react';

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
    <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
      <ShadcnTabsList className="bg-background shadow border">
        <TabsTrigger value="overview" onClick={() => onTabChange('overview')}>
          <LayoutDashboard className="w-4 h-4 mr-2" />
          Overview
        </TabsTrigger>
        
        <TabsTrigger value="dailycare" onClick={() => onTabChange('dailycare')}>
          <CalendarClock className="w-4 h-4 mr-2" />
          Daily Care
        </TabsTrigger>
        
        <TabsTrigger value="medications" onClick={() => onTabChange('medications')}>
          <Pill className="w-4 h-4 mr-2" />
          Medications
        </TabsTrigger>
        
        <TabsTrigger value="feeding" onClick={() => onTabChange('feeding')}>
          <Utensils className="w-4 h-4 mr-2" />
          Feeding
        </TabsTrigger>
        
        <TabsTrigger value="grooming" onClick={() => onTabChange('grooming')}>
          <Scissors className="w-4 h-4 mr-2" />
          Grooming
        </TabsTrigger>
        
        <TabsTrigger value="pottybreaks" onClick={() => onTabChange('pottybreaks')}>
          <PawPrint className="w-4 h-4 mr-2" />
          Potty Breaks
        </TabsTrigger>
      </ShadcnTabsList>
      
      <Button 
        onClick={onRefreshDogs} 
        variant="outline" 
        className="gap-2" 
        disabled={isRefreshing}
      >
        <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
        Refresh
      </Button>
    </div>
  );
};

export default TabsList;
