
import React from 'react';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DogFlag } from '@/types/dailyCare';

interface DogAvatarProps {
  photoUrl?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  flags?: DogFlag[];
  dog?: any;
  onClick?: (e: React.MouseEvent) => void;
}

const DogAvatar: React.FC<DogAvatarProps> = ({ 
  photoUrl,
  name,
  size = 'md',
  flags = [],
  dog,
  onClick
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base'
  };
  
  // Check if dog has any flags
  const inHeatFlag = flags.find(flag => flag.type === 'in_heat');
  const pregnantFlag = flags.find(flag => flag.type === 'pregnant');
  
  // Determine border color based on flags
  let borderClass = '';
  
  if (inHeatFlag) {
    borderClass = 'ring-2 ring-red-500 dark:ring-red-400';
  } else if (pregnantFlag) {
    borderClass = 'ring-2 ring-purple-500 dark:ring-purple-400';
  }
  
  return (
    <div 
      className={cn(
        'relative rounded-full bg-muted flex items-center justify-center overflow-hidden',
        sizeClasses[size],
        borderClass
      )}
      onClick={onClick}
    >
      {photoUrl ? (
        <img 
          src={photoUrl} 
          alt={name} 
          className="object-cover w-full h-full"
        />
      ) : (
        <User className={cn(
          'text-muted-foreground',
          size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-5 w-5' : 'h-6 w-6'
        )} />
      )}
    </div>
  );
};

export default DogAvatar;
