
import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Save, X } from 'lucide-react';

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
  const buttonText = activeCategory === 'feeding' 
    ? isSubmitting ? 'Saving...' : 'Save Feeding Issue' 
    : isSubmitting ? 'Saving...' : 'Save Observation';
    
  return (
    <div className={`flex ${isMobile ? 'w-full' : 'justify-end'} gap-3 pt-2`}>
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        className={isMobile ? 'flex-1' : ''}
      >
        <X className="h-4 w-4 mr-2" />
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={isSubmitting}
        className={`${isMobile ? 'flex-1' : ''} gap-2`}
      >
        <Save className="h-4 w-4" />
        {buttonText}
      </Button>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(FormButtons);
