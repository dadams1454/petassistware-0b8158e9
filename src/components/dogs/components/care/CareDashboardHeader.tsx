
import React from 'react';
import { RefreshCw, Filter, Download, Paintbrush } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import PersonalizationPanel from '@/components/personalization/PersonalizationPanel';

interface CareDashboardHeaderProps {
  title: string;
  onRefresh?: () => void;
  isLoading?: boolean;
}

const CareDashboardHeader: React.FC<CareDashboardHeaderProps> = ({
  title,
  onRefresh,
  isLoading = false,
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 gap-2">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
        {title}
      </h1>
      
      <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
        <PersonalizationPanel 
          trigger={
            <Button
              variant="outline"
              size={isMobile ? "icon" : "default"}
              className={isMobile ? "h-9 w-9" : "gap-1"}
              title="Personalize Interface"
            >
              <Paintbrush className="h-4 w-4" />
              {!isMobile && <span>Personalize</span>}
            </Button>
          }
        />
        
        <Button
          variant="outline"
          size={isMobile ? "icon" : "default"}
          className={isMobile ? "h-9 w-9" : "gap-1"}
          title="Filter"
        >
          <Filter className="h-4 w-4" />
          {!isMobile && <span>Filter</span>}
        </Button>
        
        <Button
          variant="outline"
          size={isMobile ? "icon" : "default"}
          className={isMobile ? "h-9 w-9" : "gap-1"}
          title="Export Data"
        >
          <Download className="h-4 w-4" />
          {!isMobile && <span>Export</span>}
        </Button>
        
        {onRefresh && (
          <Button
            variant="default"
            size={isMobile ? "icon" : "default"}
            className={`${isMobile ? "h-9 w-9" : "gap-1"} ${isLoading ? "animate-spin" : ""}`}
            onClick={onRefresh}
            disabled={isLoading}
            title="Refresh Data"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            {!isMobile && <span>Refresh</span>}
          </Button>
        )}
      </div>
    </div>
  );
};

export default CareDashboardHeader;
