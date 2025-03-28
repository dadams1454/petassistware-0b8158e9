
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';

interface DialogActionsProps {
  onClose: () => void;
  onSubmit: () => void;
  isValid?: boolean; 
  isLoading?: boolean;
  isMobile: boolean;
}

const DialogActions: React.FC<DialogActionsProps> = ({
  onClose,
  onSubmit,
  isValid = true, 
  isLoading = false,
  isMobile
}) => {
  if (isMobile) {
    return (
      <div className="flex justify-end gap-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onClose}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button 
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </div>
    );
  }

  return (
    <DialogFooter>
      <Button 
        type="button" 
        variant="outline" 
        onClick={onClose}
      >
        Cancel
      </Button>
      <Button 
        type="button"
        onClick={onSubmit}
        disabled={isLoading}
      >
        {isLoading ? 'Saving...' : 'Save Observation'}
      </Button>
    </DialogFooter>
  );
};

export default DialogActions;
