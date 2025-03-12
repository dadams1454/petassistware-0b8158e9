
import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import DogForm from '../../DogForm';

interface EditDogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dog: any;
}

const EditDogDialog: React.FC<EditDogDialogProps> = ({
  open,
  onOpenChange,
  dog
}) => {
  const queryClient = useQueryClient();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Dog</DialogTitle>
        </DialogHeader>
        <DogForm 
          dog={dog}
          onSuccess={() => {
            onOpenChange(false);
            queryClient.invalidateQueries({ queryKey: ['dogs'] });
            queryClient.invalidateQueries({ queryKey: ['dog', dog.id] });
            queryClient.invalidateQueries({ queryKey: ['allDogs'] });
          }}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditDogDialog;
