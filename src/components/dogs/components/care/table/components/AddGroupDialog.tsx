
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface AddGroupDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddGroupDialog: React.FC<AddGroupDialogProps> = ({ isOpen, onOpenChange }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Care Group</DialogTitle>
          <DialogDescription>
            Organize dogs into groups for more efficient care management.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <p className="text-sm text-muted-foreground">
            This feature is coming soon! You will be able to create custom 
            care groups to manage your dogs more efficiently.
          </p>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddGroupDialog;
