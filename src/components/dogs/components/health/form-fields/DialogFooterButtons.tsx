
import React from 'react';
import { Button } from '@/components/ui/button';

export interface DialogFooterButtonsProps {
  onCancel: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

const DialogFooterButtons: React.FC<DialogFooterButtonsProps> = ({
  onCancel,
  isSubmitting = false,
  submitLabel = 'Save'
}) => {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Saving...' : submitLabel}
      </Button>
    </div>
  );
};

export default DialogFooterButtons;
