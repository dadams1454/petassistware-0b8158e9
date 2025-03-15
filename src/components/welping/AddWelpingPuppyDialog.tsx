
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import WelpingPuppyForm from './form/WelpingPuppyForm';

interface AddWelpingPuppyDialogProps {
  litterId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => Promise<void>;
}

const AddWelpingPuppyDialog: React.FC<AddWelpingPuppyDialogProps> = ({ 
  litterId, 
  isOpen, 
  onOpenChange, 
  onSuccess 
}) => {
  // Create a wrapper function that returns a Promise<void>
  const handleSuccess = async () => {
    await onSuccess();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record New Puppy</DialogTitle>
          <DialogDescription>
            Enter the details of the newly born puppy.
          </DialogDescription>
        </DialogHeader>
        <WelpingPuppyForm 
          litterId={litterId}
          onSuccess={handleSuccess} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddWelpingPuppyDialog;
