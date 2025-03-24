
import React from 'react';
import { Button } from '@/components/ui/button';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, Dog, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface TimeTableHeaderProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  isLoading?: boolean;
  onRefresh?: () => void;
  isMobile?: boolean;
  currentDate?: Date;
  showRefreshButton?: boolean;
}

const TimeTableHeader: React.FC<TimeTableHeaderProps> = ({ 
  activeCategory, 
  onCategoryChange, 
  isLoading = false,
  onRefresh,
  isMobile = false,
  currentDate = new Date(),
  showRefreshButton = true
}) => {
  const handleCategoryChange = (category: string) => {
    onCategoryChange(category);
  };
  
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
        <TabsList className={`gap-1 ${isMobile ? 'w-full' : ''}`}>
          <TabsTrigger 
            value="pottybreaks" 
            onClick={() => handleCategoryChange('pottybreaks')}
            className={`gap-2 ${isMobile ? 'flex-1' : ''}`}
          >
            <Dog className="h-3 w-3 md:h-4 md:w-4" />
            <span className={isMobile ? 'text-xs' : ''}>Potty Breaks</span>
          </TabsTrigger>
        </TabsList>
        
        {!isMobile && (
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 ml-2">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{format(currentDate, 'MMMM d, yyyy')}</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        {showRefreshButton && onRefresh && (
          <Button
            variant="outline"
            size={isMobile ? "sm" : "default"}
            onClick={onRefresh}
            disabled={isLoading}
            className="whitespace-nowrap"
          >
            <RefreshCw className={`h-3 w-3 md:h-4 md:w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {!isMobile && <span className="ml-2">Refresh</span>}
          </Button>
        )}
      </div>
    </div>
  );
};

export default TimeTableHeader;
