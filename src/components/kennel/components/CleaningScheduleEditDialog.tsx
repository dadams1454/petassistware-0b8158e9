
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { KennelCleaningSchedule, KennelUnit } from '@/types/kennel';
import KennelCleaningScheduleForm from '../forms/KennelCleaningScheduleForm';

interface CleaningScheduleEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingSchedule: KennelCleaningSchedule | null;
  kennelUnits: KennelUnit[];
  onSubmit: (data: Partial<KennelCleaningSchedule>) => Promise<void>;
}

const CleaningScheduleEditDialog: React.FC<CleaningScheduleEditDialogProps> = ({
  open,
  onOpenChange,
  editingSchedule,
  kennelUnits,
  onSubmit
}) => {
  if (!editingSchedule) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Cleaning Schedule</DialogTitle>
        </DialogHeader>
        <KennelCleaningScheduleForm 
          onSubmit={onSubmit} 
          defaultValues={editingSchedule}
          kennelUnits={kennelUnits}
          isEditing
        />
      </DialogContent>
    </Dialog>
  );
};

export default CleaningScheduleEditDialog;
