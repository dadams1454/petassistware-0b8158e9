
import React from 'react';
import { Dog } from 'lucide-react';

interface DogAvatarProps {
  photoUrl?: string;
  name: string;
}

const DogAvatar: React.FC<DogAvatarProps> = ({ photoUrl, name }) => {
  return (
    <div className="flex items-center space-x-2">
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={name}
          className="h-8 w-8 rounded-full object-cover"
        />
      ) : (
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Dog className="h-4 w-4 text-primary" />
        </div>
      )}
      <span className="font-medium">{name}</span>
    </div>
  );
};

export default DogAvatar;
