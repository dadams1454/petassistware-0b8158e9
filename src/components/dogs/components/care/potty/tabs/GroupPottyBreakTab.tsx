
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
        <h3 className="text-lg font-medium">Group Potty Break</h3>
        <Button 
          onClick={onOpenDialog}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          New Group Break
        </Button>
      </div>

      <PottyBreakGroupSelector 
        dogs={dogs}
        onGroupSelected={onGroupSelected}
      />
    </>
  );
};

export default GroupPottyBreakTab;
