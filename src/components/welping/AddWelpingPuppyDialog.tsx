
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
          onSuccess={onSuccess} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddWelpingPuppyDialog;
