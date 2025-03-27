
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';
import { careCategories } from '@/components/dogs/components/care/CareCategories';

interface TableActionsProps {
  onAddGroup: () => void;
  isRefreshing?: boolean;
  currentDate: Date;
  activeCategory: string;
  hideTopLevelTabs?: boolean;
}

const TableActions: React.FC<TableActionsProps> = ({ 
  onAddGroup, 
  isRefreshing = false,
  currentDate,
  activeCategory,
  hideTopLevelTabs = false
}) => {
  // Get the current category name
  const currentCategoryName = careCategories.find(c => c.id === activeCategory)?.name || 'Care';
  
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          {careCategories.find(c => c.id === activeCategory)?.icon}
          <span>
            {/* Don't show duplicate title if already displayed in parent component */}
            {hideTopLevelTabs ? 'Time Table' : `${currentCategoryName} Time Table`}
          </span>
        </h2>
        <p className="text-sm text-muted-foreground">
          {format(currentDate, 'EEEE, MMMM d, yyyy')}
        </p>
      </div>
      
      <Button 
        onClick={onAddGroup} 
        size="sm" 
        variant="outline" 
        className="gap-2"
      >
        <Plus className="h-4 w-4" />
        <span className="hidden sm:inline">Add Group</span>
      </Button>
    </div>
  );
};

export default TableActions;
