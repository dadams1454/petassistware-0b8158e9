
import React from 'react';
import { Button } from '@/components/ui/button';

interface FormButtonsProps {
  onCancel: () => void;
  isSubmitting: boolean;
  isMobile?: boolean;
  activeCategory?: string;
}

const FormButtons: React.FC<FormButtonsProps> = ({
  onCancel,
  isSubmitting,
  isMobile = false,
  activeCategory = 'pottybreaks'
}) => {
  return (
    <div className={`mt-4 flex ${isMobile ? 'w-full' : 'justify-end'} gap-2`}>
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        className={isMobile ? 'flex-1' : ''}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={isSubmitting}
        className={`${isMobile ? 'flex-1' : ''} gap-2`}
      >
        {isSubmitting ? 'Saving...' : 'Save Observation'}
      </Button>
    </div>
  );
};

export default FormButtons;
