
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import WeightEntryForm from './form/WeightEntryForm';
import { WeightRecord } from '@/types/health';

interface WeightEntryDialogProps {
  dogId: string;
  onClose: () => void;
  onSave: (weightRecord: Omit<WeightRecord, 'id' | 'created_at'>) => void;
}

const WeightEntryDialog: React.FC<WeightEntryDialogProps> = ({
  dogId,
  onClose,
  onSave
}) => {
  const handleSave = async (formData: any) => {
    onSave(formData);
  };
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Weight Record</DialogTitle>
        </DialogHeader>
        
        <WeightEntryForm 
          dogId={dogId}
          onSave={handleSave}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default WeightEntryDialog;
