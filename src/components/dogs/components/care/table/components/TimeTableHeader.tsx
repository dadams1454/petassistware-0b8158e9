
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RefreshCw, Dog, Utensils, RotateCcw } from 'lucide-react';

interface TimeTableHeaderProps {
  activeCategory: string;
  onCategoryChange: (value: string) => void;
  isLoading: boolean;
  onRefresh: () => void;
  isMobile?: boolean;
  onResetFeeding?: () => void;
}

const TimeTableHeader: React.FC<TimeTableHeaderProps> = ({
  activeCategory,
  onCategoryChange,
  isLoading,
  onRefresh,
  isMobile = false,
  onResetFeeding
}) => {
  return (
    <div className="flex justify-between items-center">
      <Tabs
        value={activeCategory}
        onValueChange={onCategoryChange}
        className="w-full mr-2"
      >
        <TabsList className="grid grid-cols-2 w-full max-w-[200px]">
          <TabsTrigger value="pottybreaks" className="flex items-center gap-1.5">
            <Dog className="h-3.5 w-3.5" />
            <span>{isMobile ? "Potty" : "Potty Breaks"}</span>
          </TabsTrigger>
          <TabsTrigger value="feeding" className="flex items-center gap-1.5">
            <Utensils className="h-3.5 w-3.5" />
            <span>Feeding</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="flex items-center gap-2">
        {activeCategory === 'feeding' && onResetFeeding && (
          <Button 
            onClick={onResetFeeding} 
            variant="ghost" 
            size="sm" 
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1" />
            <span className={isMobile ? "sr-only" : ""}>Reset</span>
          </Button>
        )}
        <Button 
          onClick={onRefresh} 
          variant="outline" 
          size="sm" 
          disabled={isLoading}
          className="text-zinc-500 dark:text-zinc-400"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="sr-only">Refresh</span>
        </Button>
      </div>
    </div>
  );
};

export default TimeTableHeader;
