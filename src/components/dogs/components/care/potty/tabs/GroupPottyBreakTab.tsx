
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DogCareStatus } from '@/types/dailyCare';
import PottyBreakGroupSelector from '../PottyBreakGroupSelector';

interface GroupPottyBreakTabProps {
  dogs: DogCareStatus[];
  onOpenDialog: () => void;
  onGroupSelected: (dogIds: string[]) => void;
}

const GroupPottyBreakTab: React.FC<GroupPottyBreakTabProps> = ({
  dogs,
  onOpenDialog,
  onGroupSelected
}) => {
  return (
    <>
      <div className="flex justify-between mb-4">
        <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">Group Potty Break</h3>
        <Button 
          onClick={onOpenDialog}
          className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <Plus className="h-4 w-4" />
          New Group Break
        </Button>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/30 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
        <PottyBreakGroupSelector 
          dogs={dogs}
          onGroupSelected={onGroupSelected}
        />
      </div>
    </>
  );
};

export default GroupPottyBreakTab;
