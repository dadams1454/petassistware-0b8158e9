
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface PhotoViewerProps {
  photoUrl: string | null;
  onClose: () => void;
}

const PhotoViewer: React.FC<PhotoViewerProps> = ({ photoUrl, onClose }) => {
  if (!photoUrl) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative max-w-4xl max-h-[90vh]">
        <Button 
          variant="outline" 
          size="icon"
          className="absolute -top-12 right-0 rounded-full bg-white/20 hover:bg-white/30"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        <img 
          src={photoUrl} 
          alt="Dog" 
          className="max-w-full max-h-[90vh] rounded-lg object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
};

export default PhotoViewer;
