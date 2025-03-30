
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Puppy } from '@/types/litter'; // Import Puppy from our unified types file

interface DeletePuppyDialogProps {
  puppy: Puppy | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

const DeletePuppyDialog: React.FC<DeletePuppyDialogProps> = ({ 
  puppy, 
  onClose, 
  onConfirm 
}) => {
  if (!puppy) return null;

  return (
    <Dialog open={!!puppy} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this puppy? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeletePuppyDialog;
