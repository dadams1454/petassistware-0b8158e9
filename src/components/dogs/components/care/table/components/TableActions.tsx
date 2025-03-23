
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Plus } from 'lucide-react';

interface TableActionsProps {
  activeCategory: string;
  isRefreshing: boolean;
  onRefresh: () => void;
  onAddGroup?: () => void;
}

export const TableActions: React.FC<TableActionsProps> = ({
  activeCategory,
  isRefreshing,
  onRefresh,
  onAddGroup
}) => {
  return (
    <div className="flex items-center gap-2">
      {onAddGroup && (
        <Button
          variant="outline"
          size="sm"
          onClick={onAddGroup}
          className="mr-2"
        >
          <Plus className="h-4 w-4 mr-1" /> 
          Add Group
        </Button>
      )}
      
      <Button
        variant="outline"
        size="sm"
        onClick={onRefresh}
        disabled={isRefreshing}
      >
        <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
        Refresh
      </Button>
    </div>
  );
};
