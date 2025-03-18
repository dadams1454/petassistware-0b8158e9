
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';

interface ObservationDialogActionsProps {
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  isValid: boolean;
  isMobile?: boolean;
}

const ObservationDialogActions: React.FC<ObservationDialogActionsProps> = ({
  onCancel,
  onSubmit,
  isSubmitting,
  isValid,
  isMobile = false
}) => {
  return isMobile ? (
    <div className="flex justify-end gap-2">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        className="flex-1"
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        onClick={onSubmit}
        disabled={!isValid || isSubmitting}
        className="flex-1"
      >
        {isSubmitting ? 'Saving...' : 'Save'}
      </Button>
    </div>
  ) : (
    <DialogFooter>
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button 
        type="submit"
        onClick={onSubmit}
        disabled={!isValid || isSubmitting}
      >
        {isSubmitting ? 'Saving...' : 'Save Observation'}
      </Button>
    </DialogFooter>
  );
};

export default ObservationDialogActions;
