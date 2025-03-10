
import React from 'react';
import { Button } from '@/components/ui/button';
import { CustomButton } from '@/components/ui/custom-button';

interface FormActionsProps {
  isSubmitting: boolean;
  onCancel?: () => void;
  isEdit: boolean;
}

const FormActions = ({ isSubmitting, onCancel, isEdit }: FormActionsProps) => {
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
        {isEdit ? 'Update Litter' : 'Create Litter'}
      </CustomButton>
    </div>
  );
};

export default FormActions;
