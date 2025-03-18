
import React from 'react';
import { Dog } from 'lucide-react';

interface DogAvatarProps {
  photoUrl?: string;
  dogName: string;
  isFemale: boolean;
  onClick: () => void;
}

const DogAvatar: React.FC<DogAvatarProps> = ({ 
  photoUrl, 
  dogName, 
  isFemale, 
  onClick 
}) => {
  const genderColor = isFemale ? 'text-pink-500 dark:text-pink-400' : 'text-blue-500 dark:text-blue-400';
  
  return (
    <>
      {photoUrl ? (
        <img 
          src={photoUrl} 
          alt={dogName} 
          onClick={onClick}
          className={`w-8 h-8 rounded-full object-cover border-2 ${isFemale ? 'border-pink-300' : 'border-blue-300'} cursor-pointer hover:opacity-80 transition-opacity`}
        />
      ) : (
        <div 
          onClick={onClick}
          className={`w-8 h-8 rounded-full flex items-center justify-center ${isFemale ? 'bg-pink-100' : 'bg-blue-100'} cursor-pointer hover:opacity-80 transition-opacity`}
        >
          <Dog className={`h-4 w-4 ${genderColor}`} />
        </div>
      )}
    </>
  );
};

export default DogAvatar;
