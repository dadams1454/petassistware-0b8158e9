
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { HealthRecordTypeEnum } from '@/types/health';
import HealthRecordForm from './HealthRecordForm';

interface HealthRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dogId: string;
  recordType?: HealthRecordTypeEnum;
  recordId?: string;
  onSave: () => void;
}

const HealthRecordDialog: React.FC<HealthRecordDialogProps> = ({
  open,
  onOpenChange,
  dogId,
  recordType,
  recordId,
  onSave
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {recordId ? 'Edit Health Record' : 'Add Health Record'}
          </DialogTitle>
        </DialogHeader>
        
        <HealthRecordForm 
          dogId={dogId}
          recordType={recordType}
          recordId={recordId}
          onSave={onSave}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default HealthRecordDialog;
