
import React from 'react';
import { Button } from '@/components/ui/button';
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
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isPending}
      >
        <X className="h-4 w-4 mr-2" />
        Cancel
      </Button>
      
      <Button 
        type="submit" 
        disabled={isPending}
      >
        {isPending ? (
          <>
            <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
            {isEditing ? 'Updating...' : 'Saving...'}
          </>
        ) : (
          <>
            <Save className="h-4 w-4 mr-2" />
            {isEditing ? 'Update Dog' : 'Add Dog'}
          </>
        )}
      </Button>
    </div>
  );
};

export default DogFormActions;
