
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface DialogFooterButtonsProps {
  onCancel: () => void;
  isEditing: boolean;
  isSubmitting?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}

const DialogFooterButtons: React.FC<DialogFooterButtonsProps> = ({ 
  onCancel, 
  isEditing, 
  isSubmitting = false,
  submitLabel,
  cancelLabel = "Cancel",
  danger = false 
}) => {
  return (
    <>
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        disabled={isSubmitting}
      >
        {cancelLabel}
      </Button>
      <Button 
        type="submit" 
        variant={danger ? "destructive" : "default"}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isEditing ? 'Updating...' : 'Saving...'}
          </>
        ) : (
          submitLabel || (isEditing ? 'Update Record' : 'Add Record')
        )}
      </Button>
    </>
  );
};

export default DialogFooterButtons;
