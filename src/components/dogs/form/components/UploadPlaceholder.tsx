
import React from 'react';
import { Upload } from 'lucide-react';

interface UploadPlaceholderProps {
  onClick: () => void;
}

const UploadPlaceholder: React.FC<UploadPlaceholderProps> = ({ onClick }) => {
  return (
    <div 
      className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 h-40 w-full cursor-pointer"
      onClick={onClick}
    >
      <div className="space-y-2 text-center">
        <Upload className="h-10 w-10 text-gray-400 mx-auto" />
        <div className="text-sm text-gray-500">
          Click to upload a photo
        </div>
        <div className="text-xs text-gray-400">
          Photos are automatically compressed
        </div>
      </div>
    </div>
  );
};

export default UploadPlaceholder;
