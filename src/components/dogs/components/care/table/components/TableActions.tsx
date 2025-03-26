
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Plus, RefreshCw, Calendar, 
  Download, Filter, Settings 
} from 'lucide-react';
import { format } from 'date-fns';
import { careCategories } from '@/components/dogs/components/care/CareCategories';

interface TableActionsProps {
  onAddGroup: () => void;
  isRefreshing: boolean;
  currentDate: Date;
  activeCategory?: string;
}

const TableActions: React.FC<TableActionsProps> = ({ 
  onAddGroup, 
  isRefreshing,
  currentDate,
  activeCategory = 'pottybreaks'
}) => {
  // Get the current category name for display
  const categoryInfo = careCategories.find(c => c.id === activeCategory);
  const categoryName = categoryInfo?.name || 'Care';
  const categoryIcon = categoryInfo?.icon;
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          {categoryIcon}
          {categoryName} Schedule
        </h2>
        <p className="text-sm text-muted-foreground">
          {format(currentDate, 'EEEE, MMMM d, yyyy')}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={onAddGroup}
        >
          <Plus className="h-4 w-4" />
          <span className="hidden md:inline">Add Group</span>
        </Button>
        
        {activeCategory === 'feeding' && (
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Settings className="h-4 w-4" />
            <span className="hidden md:inline">Meal Plan</span>
          </Button>
        )}
        
        {activeCategory === 'medication' && (
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            <span className="hidden md:inline">Filter Meds</span>
          </Button>
        )}
        
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <span className="hidden md:inline">Date</span>
        </Button>
        
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Download className="h-4 w-4" />
          <span className="hidden md:inline">Export</span>
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          <span className="hidden md:inline">Refresh</span>
        </Button>
      </div>
    </div>
  );
};

export default TableActions;
