
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import PuppyForm from '@/components/litters/PuppyForm';

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
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{puppy ? 'Edit Puppy' : 'Add New Puppy'}</DialogTitle>
        </DialogHeader>
        <PuppyForm 
          initialData={puppy} 
          litterId={litterId}
          onSuccess={onSuccess} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditPuppyDialog;
