
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';

interface FormButtonsProps {
  onCancel: () => void;
  isSubmitting: boolean;
  isMobile: boolean;
  activeCategory: string;
}

const FormButtons: React.FC<FormButtonsProps> = ({
  onCancel,
  isSubmitting,
  isMobile,
  activeCategory
}) => {
  // Get button text based on category
  const getSubmitButtonText = () => {
    if (activeCategory === 'feeding') {
      return isSubmitting ? 'Saving...' : 'Record Feeding Issue';
    }
    
    return isSubmitting ? 'Saving...' : 'Save Observation';
  };

  if (isMobile) {
    return (
      <div className="mt-4 flex justify-end gap-2">
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
          disabled={isSubmitting}
          className="flex-1"
        >
          {getSubmitButtonText()}
        </Button>
      </div>
    );
  }

  return (
    <DialogFooter className="mt-4">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        disabled={isSubmitting}
      >
        {getSubmitButtonText()}
      </Button>
    </DialogFooter>
  );
};

export default FormButtons;
