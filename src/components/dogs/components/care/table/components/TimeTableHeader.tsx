
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dog, UtensilsCrossed, MessageCircle, Calendar } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { format } from 'date-fns';

interface TimeTableHeaderProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  isLoading?: boolean;
  isMobile?: boolean;
  currentDate?: Date;
}

const TimeTableHeader: React.FC<TimeTableHeaderProps> = ({ 
  activeCategory, 
  onCategoryChange, 
  isLoading = false,
  isMobile = false,
  currentDate = new Date()
}) => {
  const handleCategoryChange = (category: string) => {
    onCategoryChange(category);
  };
  
  // Get the icon for each category
  const getIcon = (category: string) => {
    switch (category) {
      case 'pottybreaks':
        return <Dog className="h-3 w-3 md:h-4 md:w-4" />;
      case 'feeding':
        return <UtensilsCrossed className="h-3 w-3 md:h-4 md:w-4" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
        <Tabs value={activeCategory}>
          <TabsList className={`gap-1 ${isMobile ? 'w-full' : ''}`}>
            <TabsTrigger 
              value="pottybreaks" 
              onClick={() => handleCategoryChange('pottybreaks')}
              className={`gap-2 ${isMobile ? 'flex-1' : ''}`}
            >
              {getIcon('pottybreaks')}
              <span className={isMobile ? 'text-xs' : ''}>Potty</span>
            </TabsTrigger>
            <TabsTrigger 
              value="feeding" 
              onClick={() => handleCategoryChange('feeding')}
              className={`gap-2 ${isMobile ? 'flex-1' : ''}`}
            >
              {getIcon('feeding')}
              <span className={isMobile ? 'text-xs' : ''}>Feeding</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        {!isMobile && (
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 ml-2">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{format(currentDate, 'MMMM d, yyyy')}</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        {!isMobile && (
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mr-2">
            <MessageCircle className="h-4 w-4" />
            <span>Right-click for observations</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeTableHeader;
