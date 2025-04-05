
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface DialogFooterButtonsProps {
  onCancel: () => void;
  isSubmitting: boolean;
  submitLabel?: string;
}

const DialogFooterButtons: React.FC<DialogFooterButtonsProps> = ({
  onCancel,
  isSubmitting,
  submitLabel = 'Save'
}) => {
  return (
    <div className="flex justify-end gap-2 pt-4">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {submitLabel}
      </Button>
    </div>
  );
};

export default DialogFooterButtons;
