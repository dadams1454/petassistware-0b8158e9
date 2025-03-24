
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface PhotoActionButtonsProps {
  onRemove: () => void;
  onSave: () => void;
  onCancel: () => void;
  isUploading: boolean;
  canRemove: boolean;
  canSave: boolean;
}

const PhotoActionButtons: React.FC<PhotoActionButtonsProps> = ({
  onRemove,
  onSave,
  onCancel,
  isUploading,
  canRemove,
  canSave
}) => {
  return (
    <div className="flex justify-between mt-4">
      <Button
        variant="destructive"
        onClick={onRemove}
        disabled={isUploading || !canRemove}
      >
        Remove Photo
      </Button>
      
      <div className="flex gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          onClick={onSave} 
          disabled={isUploading || !canSave}
        >
          {isUploading ? 'Uploading...' : 'Save Photo'}
          {!isUploading && <Check className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default PhotoActionButtons;
