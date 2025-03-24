
import React from 'react';
import { Upload } from 'lucide-react';

interface UploadButtonProps {
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadButton: React.FC<UploadButtonProps> = ({ onFileSelect }) => {
  return (
    <div className="flex items-center justify-center">
      <label className="flex flex-col items-center gap-2 cursor-pointer">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Upload className="h-6 w-6 text-primary" />
        </div>
        <span className="text-sm">Click to upload a photo</span>
        <input 
          type="file"
          className="hidden"
          accept="image/*"
          onChange={onFileSelect}
        />
      </label>
    </div>
  );
};

export default UploadButton;
