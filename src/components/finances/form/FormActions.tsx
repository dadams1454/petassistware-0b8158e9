
import React from 'react';
import { Button } from '@/components/ui/button';

interface FormActionsProps {
  isSubmitting: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({ isSubmitting }) => {
  return (
    <div className="flex justify-end">
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save Expense'}
      </Button>
    </div>
  );
};

export default FormActions;
