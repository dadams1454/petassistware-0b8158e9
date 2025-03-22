
import React from 'react';
import { DogCareStatus } from '@/types/dailyCare';

interface DogAvatarProps {
  dog: DogCareStatus;
  onClick: (e: React.MouseEvent) => void;
}

const DogAvatar: React.FC<DogAvatarProps> = ({ dog, onClick }) => {
  return (
    <div 
      className="flex-shrink-0 h-10 w-10 cursor-pointer relative" 
      onClick={onClick}
      title={`View ${dog.dog_name}'s details`}
    >
      <img 
        src={dog.dog_photo || '/placeholder.svg'} 
        alt={dog.dog_name}
        className="h-full w-full rounded-full object-cover"
      />
      
      {/* Special conditions indicators */}
      {dog.flags && dog.flags.some(flag => flag.type === 'in_heat') && (
        <span className="absolute -top-1 -right-1 h-4 w-4 bg-pink-500 rounded-full border-2 border-white dark:border-gray-900" 
              title="In heat">
        </span>
      )}
      
      {dog.flags && dog.flags.some(flag => flag.type === 'pregnant') && (
        <span className="absolute -bottom-1 -right-1 h-4 w-4 bg-blue-500 rounded-full border-2 border-white dark:border-gray-900"
              title="Pregnant">
        </span>
      )}
    </div>
  );
};

export default DogAvatar;
