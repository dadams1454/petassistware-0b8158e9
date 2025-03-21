
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RefreshCw, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface TimeTableHeaderProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  isLoading: boolean;
  onRefresh: () => void;
  isMobile: boolean;
  currentDate: Date;
}

/**
 * Header for the time table with tabs and refresh button
 */
const TimeTableHeader: React.FC<TimeTableHeaderProps> = ({
  activeCategory,
  onCategoryChange,
  isLoading,
  onRefresh,
  isMobile,
  currentDate
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-2">
      <TabsList className="h-9">
        <TabsTrigger 
          value="pottybreaks" 
          onClick={() => onCategoryChange('pottybreaks')}
          disabled={activeCategory === 'pottybreaks' || isLoading}
          className="text-xs sm:text-sm"
        >
          Potty Breaks
        </TabsTrigger>
        <TabsTrigger 
          value="feeding" 
          onClick={() => onCategoryChange('feeding')}
          disabled={activeCategory === 'feeding' || isLoading}
          className="text-xs sm:text-sm"
        >
          Feeding
        </TabsTrigger>
      </TabsList>
      
      <div className="flex items-center gap-2">
        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mr-2">
          <Calendar className="h-3 w-3" />
          <span className="hidden md:inline">{format(currentDate, 'PPPP')}</span>
          <span className="md:hidden">{format(currentDate, 'PP')}</span>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8" 
          onClick={onRefresh} 
          disabled={isLoading}
        >
          <RefreshCw className={`h-3 w-3 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
          {!isMobile && 'Refresh'}
        </Button>
      </div>
    </div>
  );
};

export default TimeTableHeader;
