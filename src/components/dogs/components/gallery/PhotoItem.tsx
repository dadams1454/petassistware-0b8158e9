
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PhotoItemProps {
  id: string;
  url: string;
  isMainPhoto: boolean;
  onDelete: (id: string) => void;
  onView: (url: string) => void;
}

const PhotoItem: React.FC<PhotoItemProps> = ({ 
  id, 
  url, 
  isMainPhoto, 
  onDelete, 
  onView 
}) => {
  const { toast } = useToast();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMainPhoto) {
      toast({
        description: "This is the main profile photo. Edit the dog to change it.",
      });
    } else {
      onDelete(id);
    }
  };

  return (
    <div className="relative group aspect-square rounded-md overflow-hidden border">
      <div 
        className="w-full h-full bg-cover bg-center cursor-pointer"
        style={{ backgroundImage: `url(${url})` }}
        onClick={() => onView(url)}
      />
      
      {/* Overlay and actions */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
        <Button 
          variant="destructive" 
          size="icon" 
          className="rounded-full"
          onClick={handleDelete}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Main photo indicator */}
      {isMainPhoto && (
        <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-md">
          Profile
        </div>
      )}
    </div>
  );
};

export default PhotoItem;
