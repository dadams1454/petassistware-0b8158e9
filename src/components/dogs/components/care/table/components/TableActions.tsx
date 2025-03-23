
import React from 'react';
import { CustomButton } from '@/components/ui/custom-button';
import { Plus, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface TableActionsProps {
  onAddGroup: () => void;
  isRefreshing: boolean;
  currentDate: Date;
}

const TableActions: React.FC<TableActionsProps> = ({ 
  onAddGroup, 
  isRefreshing,
  currentDate 
}) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-lg font-semibold">Dog Time Table</h2>
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <Calendar className="h-4 w-4" /> {format(currentDate, 'MMMM d, yyyy')}
        </p>
      </div>
      <CustomButton onClick={onAddGroup} disabled={isRefreshing}>
        <Plus className="h-4 w-4 mr-2" />
        Add Group
      </CustomButton>
    </div>
  );
};

export default TableActions;
