
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, X } from 'lucide-react';

interface LitterFormActionsProps {
  isSubmitting: boolean;
  onCancel?: () => void;
  isEditMode: boolean;
}

const LitterFormActions: React.FC<LitterFormActionsProps> = ({
  isSubmitting,
  onCancel,
  isEditMode
}) => {
  return (
    <div className="flex justify-end space-x-4 pt-4">
      {onCancel && (
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      )}
      
      <Button 
        type="submit" 
        disabled={isSubmitting}
      >
        <Save className="h-4 w-4 mr-2" />
        {isEditMode ? 'Save Changes' : 'Create Litter'}
      </Button>
    </div>
  );
};

export default LitterFormActions;
