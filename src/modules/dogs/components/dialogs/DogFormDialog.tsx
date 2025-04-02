
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import DogForm from '../DogForm';
import { DogProfile } from '../../types/dog';

interface DogFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  onCancel: () => void;
  dog?: DogProfile;
  title: string;
}

const DogFormDialog: React.FC<DogFormDialogProps> = ({
  isOpen,
  onOpenChange,
  onSuccess,
  onCancel,
  dog,
  title
}) => {
  const handleSubmit = (data: any) => {
    // This would connect to your dog mutation logic
    console.log('Dog form submitted:', data);
    onSuccess();
  };
  
  const handleCancel = () => {
    onOpenChange(false);
    onCancel();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <DogForm
          dog={dog}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={false}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DogFormDialog;
