
import React from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface DogNameCellProps {
  dog: DogCareStatus;
  onClick: (dogId: string) => void;
}

const DogNameCell: React.FC<DogNameCellProps> = ({ dog, onClick }) => {
  const hasSpecialFlags = dog.flags && dog.flags.length > 0;
  
  // Get the dog's initials for the avatar fallback
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  // Function to determine if a dog has a specific flag
  const hasFlag = (type: string): boolean => {
    return dog.flags?.some(flag => flag.type === type) || false;
  };
  
  return (
    <td 
      className="px-4 py-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
      onClick={() => onClick(dog.dog_id)}
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={dog.dog_photo} alt={dog.dog_name} />
          <AvatarFallback className="text-xs bg-primary text-primary-foreground">
            {getInitials(dog.dog_name)}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium flex items-center gap-1.5">
            {dog.dog_name}
            {dog.sex === 'female' && hasFlag('in_heat') && (
              <Badge variant="outline" className="ml-1 border-red-200 bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/50">In Heat</Badge>
            )}
            {hasFlag('pregnant') && (
              <Badge variant="outline" className="ml-1 border-purple-200 bg-purple-50 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-900/50">Pregnant</Badge>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            {dog.breed}
          </div>
          {hasFlag('special_attention') && (
            <Badge variant="outline" className="mt-1 text-xs border-amber-200 bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/50">
              Special Attention
            </Badge>
          )}
          {hasFlag('incompatible') && (
            <Badge variant="outline" className="mt-1 ml-1 text-xs border-red-200 bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/50">
              Incompatible
            </Badge>
          )}
        </div>
      </div>
    </td>
  );
};

export default DogNameCell;
