
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface FilePreviewProps {
  filePreview: string;
  fileSize: string | null;
  onClear: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ 
  filePreview, 
  fileSize, 
  onClear 
}) => {
  return (
    <div className="relative w-40 h-40 mx-auto">
      <Avatar className="w-40 h-40 border rounded-md shadow">
        <AvatarImage src={filePreview} alt="Photo preview" className="object-cover" />
        <AvatarFallback className="text-xl">Photo</AvatarFallback>
      </Avatar>
      <Button
        type="button"
        variant="destructive"
        size="icon"
        className="absolute -top-2 -right-2 rounded-full w-7 h-7"
        onClick={onClear}
      >
        <X className="h-4 w-4" />
      </Button>
      {fileSize && (
        <div className="absolute -bottom-6 w-full text-center text-xs text-muted-foreground">
          {fileSize}
        </div>
      )}
    </div>
  );
};

export default FilePreview;
