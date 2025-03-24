
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import PhotoItem from './PhotoItem';

interface Photo {
  id: string;
  url: string;
  created_at: string;
}

interface PhotoGridProps {
  photos: Photo[];
  mainPhotoUrl?: string;
  isLoading: boolean;
  onPhotoClick: (url: string) => void;
  onDeletePhoto: (id: string) => void;
  onSetAsProfile: (url: string) => void;
  onUploadClick: () => void;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({
  photos,
  mainPhotoUrl,
  isLoading,
  onPhotoClick,
  onDeletePhoto,
  onSetAsProfile,
  onUploadClick
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="bg-muted p-3 rounded-full mb-4">
            <Plus className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No photos</h3>
          <p className="text-center text-muted-foreground mb-4">
            Add photos to create a gallery for this dog.
          </p>
          <Button 
            variant="outline"
            onClick={onUploadClick}
          >
            Upload first photo
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photo) => (
        <PhotoItem
          key={photo.id}
          id={photo.id}
          url={photo.url}
          isProfilePhoto={mainPhotoUrl === photo.url}
          onDelete={onDeletePhoto}
          onView={onPhotoClick}
          onSetAsProfile={onSetAsProfile}
        />
      ))}
    </div>
  );
};

export default PhotoGrid;
