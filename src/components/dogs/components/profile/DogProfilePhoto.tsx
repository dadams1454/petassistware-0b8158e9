
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, PawPrint } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Heart } from 'lucide-react';
import DogPhotoUpload from './DogPhotoUpload';

interface DogProfilePhotoProps {
  dogId: string;
  photoUrl?: string;
  name: string;
  hasPedigree?: boolean;
}

const DogProfilePhoto: React.FC<DogProfilePhotoProps> = ({ 
  dogId, 
  photoUrl, 
  name,
  hasPedigree 
}) => {
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  
  return (
    <div className="relative">
      {isEditingPhoto ? (
        <DogPhotoUpload
          dogId={dogId}
          currentPhoto={photoUrl}
          onClose={() => setIsEditingPhoto(false)}
        />
      ) : (
        <>
          {photoUrl ? (
            <div className="h-32 w-32 md:h-48 md:w-48 rounded-lg overflow-hidden border-2 border-primary/20">
              <img
                src={photoUrl}
                alt={name}
                className="h-full w-full object-cover"
              />
              <Button 
                size="sm" 
                variant="secondary" 
                className="absolute bottom-2 right-2"
                onClick={() => setIsEditingPhoto(true)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="h-32 w-32 md:h-48 md:w-48 rounded-lg flex items-center justify-center bg-primary/10 border-2 border-primary/20">
              <PawPrint className="h-16 w-16 text-primary/50" />
              <Button 
                size="sm" 
                variant="secondary" 
                className="absolute bottom-2 right-2"
                onClick={() => setIsEditingPhoto(true)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          {hasPedigree && (
            <Badge className="absolute top-2 right-2 bg-purple-500" variant="secondary">
              <Heart className="h-3 w-3 mr-1" />
              Pedigree
            </Badge>
          )}
        </>
      )}
    </div>
  );
};

export default DogProfilePhoto;
