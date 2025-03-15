
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import PuppyForm from '@/components/litters/PuppyForm';
import { Puppy } from './types';

interface EditPuppyDialogProps {
  puppy: Puppy | null;
  litterId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => Promise<void>;
}

const EditPuppyDialog: React.FC<EditPuppyDialogProps> = ({ 
  puppy, 
  litterId, 
  isOpen, 
  onOpenChange, 
  onSuccess 
}) => {
  // Create a wrapper function that returns a Promise<void>
  const handleSuccess = async () => {
    try {
      await onSuccess();
      console.log('onSuccess completed in EditPuppyDialog');
    } catch (error) {
      console.error('Error in onSuccess callback from EditPuppyDialog:', error);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{puppy ? 'Edit Puppy' : 'Add New Puppy'}</DialogTitle>
        </DialogHeader>
        <PuppyForm 
          initialData={puppy} 
          litterId={litterId}
          onSuccess={handleSuccess} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditPuppyDialog;
