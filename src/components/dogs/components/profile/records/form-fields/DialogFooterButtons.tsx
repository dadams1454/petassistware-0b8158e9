
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface DialogFooterButtonsProps {
  onCancel: () => void;
  isSubmitting: boolean;
  isEdit?: boolean;
  disabled?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  className?: string;
}

const DialogFooterButtons: React.FC<DialogFooterButtonsProps> = ({
  onCancel,
  isSubmitting,
  isEdit = false,
  disabled = false,
  submitLabel,
  cancelLabel = "Cancel",
  className
}) => {
  return (
    <div className={`flex justify-end gap-2 pt-4 ${className || ''}`}>
      <Button type="button" variant="outline" onClick={onCancel}>
        {cancelLabel}
      </Button>
      <Button type="submit" disabled={isSubmitting || disabled}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {submitLabel || (isEdit ? 'Update' : 'Save')}
      </Button>
    </div>
  );
};

export default DialogFooterButtons;
