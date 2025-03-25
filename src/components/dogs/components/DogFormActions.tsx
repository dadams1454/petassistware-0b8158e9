
import React from 'react';
import { ActionButton } from '@/components/ui/standardized';
import { Save, X } from 'lucide-react';

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
      <ActionButton
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isPending}
        icon={<X className="h-4 w-4" />}
      >
        Cancel
      </ActionButton>
      
      <ActionButton 
        type="submit" 
        isLoading={isPending}
        loadingText={isEditing ? "Updating..." : "Saving..."}
        icon={<Save className="h-4 w-4" />}
      >
        {isEditing ? 'Update Dog' : 'Add Dog'}
      </ActionButton>
    </div>
  );
};

export default DogFormActions;
