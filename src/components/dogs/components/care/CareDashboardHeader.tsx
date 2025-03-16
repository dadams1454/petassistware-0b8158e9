
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Grid3X3, RefreshCw } from 'lucide-react';

interface CareDashboardHeaderProps {
  view: string;
  onViewChange: (value: string) => void;
  onRefresh?: () => void;
}

const CareDashboardHeader: React.FC<CareDashboardHeaderProps> = ({ 
  view, 
  onViewChange,
  onRefresh 
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Daily Care</h1>
        <p className="text-muted-foreground">
          Monitor and log care activities for all dogs
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        {onRefresh && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onRefresh}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        )}
        
        <Tabs 
          value={view} 
          onValueChange={onViewChange}
          className="w-[200px]"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="table">
              <Calendar className="h-4 w-4 mr-2" />
              Table
            </TabsTrigger>
            <TabsTrigger value="cards">
              <Grid3X3 className="h-4 w-4 mr-2" />
              Cards
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default CareDashboardHeader;
