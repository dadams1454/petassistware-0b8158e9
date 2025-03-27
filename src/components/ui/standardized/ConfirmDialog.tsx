
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'; // Added for backward compatibility
  isLoading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  confirmVariant = 'default',
  variant, // Added for backward compatibility
  isLoading = false,
}) => {
  // Use variant prop for backward compatibility if confirmVariant is not provided
  const buttonVariant = confirmVariant || variant || 'default';

  const handleCancel = () => {
    onOpenChange(false);
    if (onCancel) onCancel();
  };

  const handleConfirm = () => {
    onConfirm();
    // Dialog will be closed by the calling component after the operation is complete
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex space-x-2 justify-end">
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button 
            variant={buttonVariant} 
            onClick={handleConfirm} 
            disabled={isLoading}
            className={isLoading ? 'opacity-80' : ''}
          >
            {isLoading ? 'Processing...' : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
