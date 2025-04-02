
import React from 'react';
import { Image, PawPrint } from 'lucide-react';

interface PuppyPhotoProps {
  photoUrl: string | null;
  name: string | null;
  size?: 'sm' | 'md' | 'lg';
}

const PuppyPhoto: React.FC<PuppyPhotoProps> = ({ 
  photoUrl, 
  name,
  size = 'md'
}) => {
  const dimensions = {
    sm: 'h-12 w-12',
    md: 'h-16 w-16',
    lg: 'h-20 w-20'
  };

  const iconSize = {
    sm: 'h-5 w-5',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <>
      {photoUrl ? (
        <div className={`relative ${dimensions[size]} rounded-md overflow-hidden border`}>
          <img
            src={photoUrl}
            alt={name || 'Puppy photo'}
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div className={`flex items-center justify-center ${dimensions[size]} bg-muted rounded-md`}>
          <PawPrint className={`${iconSize[size]} text-muted-foreground`} />
        </div>
      )}
    </>
  );
};

export default PuppyPhoto;
