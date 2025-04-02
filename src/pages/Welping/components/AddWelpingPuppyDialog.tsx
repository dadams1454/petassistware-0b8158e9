
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AddWelpingPuppyForm from './AddWelpingPuppyForm';

interface AddWelpingPuppyDialogProps {
  litterId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AddWelpingPuppyDialog: React.FC<AddWelpingPuppyDialogProps> = ({
  litterId,
  isOpen,
  onOpenChange,
  onSuccess,
}) => {
  const handleSuccess = () => {
    onSuccess();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Record New Puppy</DialogTitle>
        </DialogHeader>
        <AddWelpingPuppyForm
          litterId={litterId}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddWelpingPuppyDialog;
