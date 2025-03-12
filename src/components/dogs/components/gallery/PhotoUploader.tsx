
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface PhotoUploaderProps {
  uploading: boolean;
  onUploadClick: () => void;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({ uploading, onUploadClick }) => {
  return (
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-medium">Dog Photos</h3>
      <Button 
        onClick={onUploadClick}
        disabled={uploading}
      >
        <Upload className="h-4 w-4 mr-2" />
        {uploading ? 'Uploading...' : 'Add Photo'}
      </Button>
    </div>
  );
};

export default PhotoUploader;
