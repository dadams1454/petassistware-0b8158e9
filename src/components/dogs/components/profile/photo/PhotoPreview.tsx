
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface PhotoPreviewProps {
  imageUrl: string;
  onClear?: () => void;
  isEditable?: boolean;
}

const PhotoPreview: React.FC<PhotoPreviewProps> = ({ 
  imageUrl, 
  onClear, 
  isEditable = true 
}) => {
  return (
    <div className="relative w-40 h-40 mx-auto">
      <img 
        src={imageUrl} 
        alt="Preview" 
        className="w-full h-full rounded-full object-cover"
      />
      {isEditable && onClear && (
        <Button
          size="sm"
          variant="destructive"
          className="absolute top-0 right-0 rounded-full p-1"
          onClick={onClear}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default PhotoPreview;
