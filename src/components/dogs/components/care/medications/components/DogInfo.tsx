
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DogInfoProps } from '../types/medicationTypes';

const DogInfo: React.FC<DogInfoProps> = ({ dogName, dogPhoto, breed }) => {
  // Get initials for the avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <div className="flex items-center space-x-3">
      <Avatar className="h-8 w-8 border">
        <AvatarImage src={dogPhoto || undefined} alt={dogName} />
        <AvatarFallback>{getInitials(dogName)}</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-medium text-sm leading-tight">{dogName}</p>
        {breed && <p className="text-xs text-muted-foreground leading-tight">{breed}</p>}
      </div>
    </div>
  );
};

export default DogInfo;
