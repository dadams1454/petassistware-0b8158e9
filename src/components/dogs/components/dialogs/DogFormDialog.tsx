
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import DogForm from '../../DogForm';

interface DogFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  onCancel: () => void;
  dog?: any;
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
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DogForm 
          dog={dog}
          onSuccess={onSuccess}
          onCancel={onCancel}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DogFormDialog;
