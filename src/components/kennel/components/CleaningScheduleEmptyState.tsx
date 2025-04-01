
import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock, Plus } from 'lucide-react';
import { EmptyState } from '@/components/ui/standardized';

interface CleaningScheduleEmptyStateProps {
  onAddClick: () => void;
  disabled: boolean;
}

const CleaningScheduleEmptyState: React.FC<CleaningScheduleEmptyStateProps> = ({
  onAddClick,
  disabled
}) => {
  return (
    <EmptyState 
      title="No Cleaning Schedules" 
      description="Set up cleaning schedules to maintain sanitation."
      icon={<Clock className="h-12 w-12 text-muted-foreground" />}
      action={
        <Button 
          onClick={onAddClick}
          disabled={disabled}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Cleaning Schedule
        </Button>
      }
    />
  );
};

export default CleaningScheduleEmptyState;
