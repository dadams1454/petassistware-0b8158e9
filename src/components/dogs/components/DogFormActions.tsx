
import React from 'react';
import { Button } from '@/components/ui/button';
import { UseMutationResult } from '@tanstack/react-query';

interface DogFormActionsProps {
  isEditing: boolean;
  isPending: boolean;
  onCancel: () => void;
}

const DogFormActions: React.FC<DogFormActionsProps> = ({
  isEditing,
  isPending,
  onCancel,
}) => {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isPending}
      >
        Cancel
      </Button>
      <Button type="submit" disabled={isPending}>
        {isPending ? (
          <span className="flex items-center">
            <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
            {isEditing ? 'Updating...' : 'Saving...'}
          </span>
        ) : (
          <span>{isEditing ? 'Update Dog' : 'Add Dog'}</span>
        )}
      </Button>
    </div>
  );
};

export default DogFormActions;
