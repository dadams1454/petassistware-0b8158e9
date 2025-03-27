
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { careCategories } from '@/components/dogs/components/care/CareCategories';

interface TableActionsProps {
  onAddGroup: () => void;
  isRefreshing: boolean;
  currentDate: Date;
  activeCategory: string;
  hideTopLevelTabs?: boolean;
}

const TableActions: React.FC<TableActionsProps> = ({
  onAddGroup,
  isRefreshing,
  currentDate,
  activeCategory,
  hideTopLevelTabs = false
}) => {
  // Get the current category info
  const currentCategoryInfo = careCategories.find(c => c.id === activeCategory);
  const categoryName = currentCategoryInfo?.name || 'Care';
  const categoryIcon = currentCategoryInfo?.icon;
  
  // Format the date for the header
  const formattedDate = format(currentDate, 'EEEE, MMMM d, yyyy');
  
  return (
    <div className="flex justify-between items-center">
      <div>
        {hideTopLevelTabs && (
          <div className="flex items-center space-x-2">
            {categoryIcon}
            <h3 className="text-lg font-semibold">{categoryName} Time Table</h3>
          </div>
        )}
        <p className="text-sm text-muted-foreground">{formattedDate}</p>
      </div>
      
      <div className="flex items-center gap-2">
        {activeCategory === 'pottybreaks' && (
          <Button size="sm" onClick={onAddGroup} className="flex gap-1">
            <Plus className="h-4 w-4" />
            <span>Add Group</span>
          </Button>
        )}
        
        <Button 
          size="sm" 
          variant="outline" 
          disabled={isRefreshing}
          className="flex gap-1"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </Button>
      </div>
    </div>
  );
};

export default TableActions;
