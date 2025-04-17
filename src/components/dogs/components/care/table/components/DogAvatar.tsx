
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DogCareStatus, DogFlag } from '@/types/dailyCare';

export interface DogAvatarProps {
  name: string;
  photoUrl?: string;
  flags?: DogFlag[];
  onClick?: (e: React.MouseEvent) => void;
  size?: 'sm' | 'md' | 'lg';
  dog?: DogCareStatus; // Keeping this property
}

const DogAvatar: React.FC<DogAvatarProps> = ({
  name,
  photoUrl,
  flags = [],
  onClick,
  size = 'md',
  dog
}) => {
  // Determine size class
  const sizeClass = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  }[size];
  
  // Get initials for the fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="relative">
      <Avatar
        className={`${sizeClass} cursor-pointer relative`}
        onClick={onClick}
        data-dog-id={dog?.dog_id}
      >
        <AvatarImage src={photoUrl} alt={name} />
        <AvatarFallback>
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>
      
      {/* Display flags as small colored dots */}
      {flags && flags.length > 0 && (
        <div className="absolute -top-1 -right-1 flex">
          {flags.slice(0, 3).map((flag, index) => (
            <div
              key={flag.id || index}
              className="h-3 w-3 rounded-full border border-background"
              style={{
                backgroundColor: flag.color || '#888',
                marginLeft: index > 0 ? '-3px' : '0',
                zIndex: flags.length - index
              }}
              title={flag.name}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DogAvatar;
