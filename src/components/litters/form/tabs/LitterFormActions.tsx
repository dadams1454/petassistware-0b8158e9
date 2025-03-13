
import React from 'react';
import { Button } from '@/components/ui/button';
import { CustomButton } from '@/components/ui/custom-button';

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
    <div className="flex justify-end space-x-2 pt-4">
      {onCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      )}
      <CustomButton
        type="submit"
        variant="primary"
        isLoading={isSubmitting}
        fullWidth={false}
      >
        {isEditMode ? 'Update Litter' : 'Create Litter'}
      </CustomButton>
    </div>
  );
};

export default LitterFormActions;
