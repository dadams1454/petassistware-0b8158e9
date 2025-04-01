
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { KennelCleaningSchedule, KennelUnit } from '@/types/kennel';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import KennelCleaningScheduleForm from '../forms/KennelCleaningScheduleForm';

interface CleaningScheduleAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kennelUnits: KennelUnit[];
  onSubmit: (data: Omit<KennelCleaningSchedule, 'id' | 'created_at'>) => Promise<void>;
}

const CleaningScheduleAddDialog: React.FC<CleaningScheduleAddDialogProps> = ({
  open,
  onOpenChange,
  kennelUnits,
  onSubmit
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" disabled={kennelUnits.length === 0}>
          <Plus className="h-4 w-4 mr-2" />
          Add Cleaning Schedule
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Cleaning Schedule</DialogTitle>
        </DialogHeader>
        <KennelCleaningScheduleForm 
          onSubmit={onSubmit} 
          kennelUnits={kennelUnits}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CleaningScheduleAddDialog;
