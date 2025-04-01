
import React from 'react';
import { Calendar } from 'lucide-react';
import { EmptyState } from '@/components/ui/standardized';
import { Button } from '@/components/ui/button';

interface CleaningScheduleEmptyStateProps {
  onAddClick: () => void;
  disabled?: boolean;
}

const CleaningScheduleEmptyState: React.FC<CleaningScheduleEmptyStateProps> = ({ 
  onAddClick,
  disabled = false
}) => {
  return (
    <EmptyState
      title="No Cleaning Schedules Found"
      description="Create cleaning schedules to keep track of kennel maintenance tasks."
      icon={<Calendar className="h-12 w-12 text-muted-foreground" />}
      action={{
        label: "Add Cleaning Schedule",
        onClick: onAddClick,
        disabled: disabled
      }}
    />
  );
};

export default CleaningScheduleEmptyState;
