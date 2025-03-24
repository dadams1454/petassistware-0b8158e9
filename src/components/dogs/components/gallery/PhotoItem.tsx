
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Trash, UserCircle } from 'lucide-react';

interface PhotoItemProps {
  id: string;
  url: string;
  isProfilePhoto: boolean;
  onDelete: (id: string) => void;
  onView: (url: string) => void;
  onSetAsProfile: (url: string) => void;
}

const PhotoItem: React.FC<PhotoItemProps> = ({ 
  id, 
  url, 
  isProfilePhoto, 
  onDelete, 
  onView,
  onSetAsProfile
}) => {
  return (
    <div className="relative group aspect-square rounded-md overflow-hidden border">
      <div 
        className="w-full h-full bg-cover bg-center cursor-pointer"
        style={{ backgroundImage: `url(${url})` }}
        onClick={() => onView(url)}
      />
      
      {/* Overlay and actions */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            {!isProfilePhoto && (
              <DropdownMenuItem onClick={() => onSetAsProfile(url)}>
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Set as profile photo</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem 
              onClick={() => onDelete(id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash className="mr-2 h-4 w-4" />
              <span>Delete photo</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Profile photo indicator */}
      {isProfilePhoto && (
        <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
          Profile Photo
        </div>
      )}
    </div>
  );
};

export default PhotoItem;
